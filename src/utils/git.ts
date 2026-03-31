import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');

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
      const { stdout } = await execa('git', args, { cwd: CONTENT_ROOT });
      return stdout;
    } catch (error) {
      console.error(`Git command failed: git ${args.join(' ')}`, error);
      throw new Error(`Git error: ${(error as Error).message}`);
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
   * Configures the remote origin URL, embedding the token if provided.
   */
  async setRemote(url: string, token?: string) {
    let finalUrl = url;
    if (token && url.startsWith('https://')) {
      finalUrl = url.replace('https://', `https://${token}@`);
    }

    try {
      // Check if origin exists
      await this.exec(['remote', 'get-url', 'origin']);
      await this.exec(['remote', 'set-url', 'origin', finalUrl]);
    } catch {
      // If it fails, origin didn't exist
      await this.exec(['remote', 'add', 'origin', finalUrl]);
    }
  },

  /**
   * Pulls changes from the configured branch.
   * Automatically initializes the repository if it's not yet a git repo.
   */
  async sync(branch: string = 'main') {
    const isGit = fs.existsSync(path.join(CONTENT_ROOT, '.git'));
    
    if (!isGit) {
      // Basic initialization if .git is missing
      await this.exec(['init']);
    }

    return await this.exec(['pull', 'origin', branch]);
  },

  /**
   * Commits and pushes changes to the configured branch.
   */
  async commitAndPush(message: string, branch: string = 'main') {
    await this.exec(['add', '.']);
    await this.exec(['commit', '-m', message]);
    return await this.exec(['push', 'origin', branch]);
  },

  /**
   * Gets the list of modified files.
   */
  async getDiff() {
    try {
      const status = await this.exec(['status', '--porcelain']);
      if (!status) return [];
      
      return status.split('\n').filter(Boolean).map(line => {
        const type = line.slice(0, 2).trim();
        const file = line.slice(3).trim();
        return { file, type }; // 'M' = Modified, 'A' = Added, 'D' = Deleted
      });
    } catch {
      return [];
    }
  },

  /**
   * Gets the raw diff text for a specific file.
   */
  async getFileDiff(file: string) {
    try {
      return await this.exec(['diff', 'HEAD', file]);
    } catch {
      return '';
    }
  },

  /**
   * Gets the current git status.
   */
  async getStatus() {
    try {
      const status = await this.exec(['status', '--porcelain']);
      return status ? 'dirty' : 'clean';
    } catch {
      return 'not_initialized';
    }
  }
};
