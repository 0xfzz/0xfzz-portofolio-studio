import * as fsPromises from 'fs/promises';
import * as path from 'path';

// Use __dirname to get an absolute path relative to THIS file's location,
// rather than relying on process.cwd() which may differ in Next.js/Turbopack.
const CONTENT_ROOT = (function() {
  if (process.env.CONTENT_PATH) {
    return path.resolve(process.env.CONTENT_PATH);
  }
  
  // In development, process.cwd() should point to the Next.js project root.
  // We normalize this path to handle Windows drive letter inconsistencies.
  const root = path.resolve(process.cwd(), 'content');
  console.log(`[FSService] Initialized CONTENT_ROOT: ${root}`);
  return root;
})();

function resolvePath(relativePath: string): string {
  // 1. Resolve to an absolute path first
  const resolved = path.resolve(CONTENT_ROOT, relativePath);
  
  // 2. Normalize both for the security check (lowercase + consistent separators)
  const normalizedResolved = path.normalize(resolved).toLowerCase();
  const normalizedRoot = path.normalize(CONTENT_ROOT).toLowerCase();

  // 3. Ensure the root check has a trailing separator to prevent "content-secret" matches
  const rootWithTrailing = normalizedRoot.endsWith(path.sep) ? normalizedRoot : normalizedRoot + path.sep;

  if (!normalizedResolved.startsWith(rootWithTrailing) && normalizedResolved !== normalizedRoot) {
    console.error(`[FSService] Security violation: "${normalizedResolved}" is outside "${rootWithTrailing}"`);
    throw new Error(`Security violation: Path traversal detected for "${relativePath}"`);
  }
  return resolved;
}

async function readJson<T>(relativePath: string): Promise<T> {
  const filePath = resolvePath(relativePath);
  const content = await fsPromises.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function writeJson(relativePath: string, data: unknown): Promise<void> {
  const filePath = resolvePath(relativePath);
  const dir = path.dirname(filePath);
  await fsPromises.mkdir(dir, { recursive: true });
  await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readMarkdown(relativePath: string): Promise<string> {
  const filePath = resolvePath(relativePath);
  return fsPromises.readFile(filePath, 'utf-8');
}

async function writeMarkdown(relativePath: string, content: string): Promise<void> {
  const filePath = resolvePath(relativePath);
  const dir = path.dirname(filePath);
  await fsPromises.mkdir(dir, { recursive: true });
  await fsPromises.writeFile(filePath, content, 'utf-8');
}

async function isDirectory(relativePath: string): Promise<boolean> {
  try {
    const fullPath = resolvePath(relativePath);
    const stat = await fsPromises.stat(fullPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function readDirectory(relativePath: string): Promise<unknown[]> {
  const dirPath = resolvePath(relativePath);
  const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
  const files = entries.filter(
    (e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.json'))
  );

  const results = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dirPath, file.name);
      const content = await fsPromises.readFile(fullPath, 'utf-8');

      if (file.name.endsWith('.json')) {
        return {
          ...JSON.parse(content),
          _slug: file.name.replace('.json', ''),
          _type: 'json',
        };
      }

      // Simple frontmatter parser for .md files
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      const metadata: Record<string, unknown> = {
        _slug: file.name.replace('.md', ''),
        _type: 'markdown',
      };

      if (fmMatch) {
        const yaml = fmMatch[1];
        yaml.split('\n').forEach((line) => {
          const colonIdx = line.indexOf(':');
          if (colonIdx === -1) return;
          const key = line.slice(0, colonIdx).trim();
          const rawVal = line.slice(colonIdx + 1).trim().replace(/^"(.*)"$/, '$1');
          if (!key) return;

          if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
            metadata[key] = rawVal
              .slice(1, -1)
              .split(',')
              .map((s) => s.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
          } else {
            metadata[key] = rawVal;
          }
        });
      }

      return metadata;
    })
  );

  return results;
}

async function deleteFile(relativePath: string): Promise<void> {
  const filePath = resolvePath(relativePath);
  await fsPromises.unlink(filePath);
}

export const FSService = {
  contentRoot: CONTENT_ROOT,
  resolvePath,
  isDirectory,
  readJson,
  writeJson,
  readMarkdown,
  writeMarkdown,
  readDirectory,
  deleteFile,
};
