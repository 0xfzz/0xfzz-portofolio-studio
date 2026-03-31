import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');

export interface DiffEntry {
  file: string;
  type: string;
  category: 'LOCAL' | 'LOCAL COMMIT';
  commitMsg?: string;
  commitHash?: string;
}

export interface SyncCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export const GitService = {
  /**
   * Ensures the content directory exists.
   */
  ensureDir() {
    if (!fs.existsSync(CONTENT_ROOT)) {
      fs.mkdirSync(CONTENT_ROOT, { recursive: true });
    }
  },

  /**
   * Executes a git command in the content directory.
   */
  async exec(args: string[]) {
    this.ensureDir();
    try {
      const { stdout } = await execa('git', ['-c', 'credential.helper=', ...args], { 
        cwd: CONTENT_ROOT,
        timeout: 45000,
        env: {
          ...process.env,
          GIT_ASKPASS: 'true',
          GITHUB_TOKEN: '',
          GH_TOKEN: ''
        }
      });
      return stdout;
    } catch (error) {
      console.error(`Git command failed: git ${args.join(' ')}`, error);
      const msg = (error as Error).message;
      if (msg.includes('403')) {
        throw new Error(`Git error 403: Authentication successful but PERMISSION DENIED. 
Please ensure your Fine-grained PAT has 'Repository: Contents -> Read and Write' permissions for this repo.`);
      }
      if (msg.includes('GH007')) {
        throw new Error(`Git error GH007: Private email address detected. 
Please use your GitHub no-reply email in the Identity settings.`);
      }
      throw new Error(`Git error: ${msg}`);
    }
  },

  /**
   * Configures global/local git identity for the repository.
   */
  async setIdentity(name: string, email: string) {
    await this.exec(['config', 'user.name', name]);
    await this.exec(['config', 'user.email', email]);
  },

  /**
   * Configures the remote origin URL, embedding the token correctly.
   */
  async setRemote(url: string, token?: string) {
    if (!url) return;
    
    let finalUrl = url;
    if (token && url.startsWith('https://')) {
      finalUrl = url.replace('https://', `https://x-access-token:${token}@`);
    }

    try {
      await this.exec(['remote', 'get-url', 'origin']);
      await this.exec(['remote', 'set-url', 'origin', finalUrl]);
    } catch {
      await this.exec(['remote', 'add', 'origin', finalUrl]);
    }
  },

  /**
   * Pulls changes from current remote.
   */
  async sync(branch: string = 'main') {
    const isGit = fs.existsSync(path.join(CONTENT_ROOT, '.git'));
    if (!isGit) {
      await this.exec(['init', '-b', branch]);
    }

    try {
      await this.exec(['fetch', 'origin', branch]);
      return await this.exec(['pull', 'origin', branch, '--rebase']);
    } catch (err) {
      return `Sync info: ${err}`;
    }
  },

  /**
   * Stages, commits, and pushes changes.
   */
  async commitAndPush(message: string, branch: string = 'main') {
    await this.exec(['add', '.']);
    
    try {
      await this.exec(['commit', '-m', message]);
    } catch (err) {
      if ((err as Error).message.includes('nothing to commit')) {
        // Fall through
      } else {
        throw err;
      }
    }

    return await this.exec(['push', '-u', 'origin', `HEAD:${branch}`]);
  },

  /**
   * Destructive actions to reset the repository state.
   */
  async resetToRemote(branch: string = 'main', mode: 'soft' | 'hard' = 'soft') {
    try {
      // 1. Fetch latest state
      await this.exec(['fetch', 'origin', branch]);
      
      if (mode === 'soft') {
        // Keeps files but undoes the commit
        await this.exec(['reset', '--soft', `origin/${branch}`]);
      } else {
        // Completely deletes both commits and local work
        await this.exec(['reset', '--hard', `origin/${branch}`]);
        // Also remove untracked files
        await this.exec(['clean', '-fd']);
      }
      return true;
    } catch (e) {
      throw new Error(`Reset failed: ${(e as Error).message}`);
    }
  },

  async getStatus() {
    try {
      const isGit = fs.existsSync(path.join(CONTENT_ROOT, '.git'));
      if (!isGit) return { status: 'not_initialized', localCount: 0, unpushedCount: 0 };
      
      const statusRaw = await this.exec(['status', '--porcelain']);
      const localCount = statusRaw.split('\n').filter(Boolean).length;
      
      let unpushedCount = 0;
      try {
        const branchRes = await this.exec(['rev-parse', '--abbrev-ref', 'HEAD']);
        const branch = branchRes.trim();
        // Count unique files in commits ahead of origin/branch
        const filesRaw = await this.exec(['diff', '--name-only', `origin/${branch}`, 'HEAD']);
        unpushedCount = filesRaw.split('\n').filter(Boolean).length;
      } catch (e) {}

      return { 
        status: (localCount > 0 || unpushedCount > 0) ? 'dirty' : 'clean', 
        localCount, 
        unpushedCount 
      };
    } catch {
      return { status: 'not_initialized', localCount: 0, unpushedCount: 0 };
    }
  },

  /**
   * Gets categorized diff data.
   */
  async getCategorizedDiff(branch: string = 'main') {
    try {
      // Ensure origin is up-to-date
      try { await this.exec(['fetch', 'origin', branch]); } catch {}

      const results: { local: DiffEntry[], unpushed: DiffEntry[], synced: SyncCommit[] } = {
        local: [],
        unpushed: [],
        synced: []
      };

      // A. LOCAL CHANGES
      const statusRaw = await this.exec(['status', '--porcelain']);
      const localFiles = statusRaw.split('\n').filter(Boolean).map(line => ({
        file: line.slice(3).trim(),
        type: line.slice(0, 1).trim() || 'M',
        category: 'LOCAL' as const
      }));
      results.local = localFiles;

      // B. UNPUSHED COMMITS
      try {
        const logRaw = await this.exec(['log', `origin/${branch}..HEAD`, '--name-status', '--pretty=format:COMMIT:%H|%s|%an|%ad']);
        let currentCommit: { hash: string, msg: string } | null = null;

        logRaw.split('\n').filter(Boolean).forEach(line => {
          if (line.startsWith('COMMIT:')) {
            const [hash, msg] = line.replace('COMMIT:', '').split('|');
            currentCommit = { hash, msg };
          } else {
            const parts = line.split('\t');
            if (parts.length >= 2 && currentCommit) {
              const file = parts[1].trim();
              // ONLY add if not in local dirty files AND not already in unpushed (deduplicate)
              if (!results.local.some(f => f.file === file) && !results.unpushed.some(f => f.file === file)) {
                results.unpushed.push({
                  file,
                  type: parts[0].trim()[0],
                  category: 'LOCAL COMMIT',
                  commitMsg: currentCommit.msg,
                  commitHash: currentCommit.hash
                });
              }
            }
          }
        });
      } catch (e) {}

      // C. SYNCED COMMITS (Last 5)
      try {
        const syncedRaw = await this.exec(['log', '-5', `origin/${branch}`, '--pretty=format:%H|%s|%an|%ar']);
        results.synced = syncedRaw.split('\n').filter(Boolean).map(line => {
          const [hash, message, author, date] = line.split('|');
          return { hash, message, author, date };
        });
      } catch {}

      return results;
    } catch {
      return { local: [], unpushed: [], synced: [] };
    }
  },

  async getFileDiff(file: string, branch: string = 'main', category: string = 'LOCAL') {
    try {
      if (category === 'LOCAL') {
        const diff = await this.exec(['diff', 'HEAD', '--', file]);
        if (!diff) {
          // If empty, it might be untracked (??)
          try {
            return await this.exec(['diff', '--no-index', '/dev/null', file]);
          } catch {
            return '';
          }
        }
        return diff;
      } else {
        return await this.exec(['diff', `origin/${branch}`, 'HEAD', '--', file]);
      }
    } catch {
      return '';
    }
  }
};
