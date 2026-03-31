import * as fsPromises from 'fs/promises';
import * as path from 'path';

const CONTENT_ROOT = path.resolve(process.env.CONTENT_PATH || '../frontend/content');

function resolvePath(relativePath: string): string {
  const resolved = path.resolve(CONTENT_ROOT, relativePath);
  const normalizedResolved = resolved.toLowerCase();
  const normalizedRoot = CONTENT_ROOT.toLowerCase();

  if (!normalizedResolved.startsWith(normalizedRoot)) {
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

export const FSService = {
  resolvePath,
  isDirectory,
  readJson,
  writeJson,
  readMarkdown,
  writeMarkdown,
  readDirectory,
};
