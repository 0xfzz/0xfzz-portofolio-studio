import * as fs from 'fs/promises';
import * as path from 'path';

const CONFIG_PATH = path.resolve(process.cwd(), 'git-config.json');

export interface GitConfig {
  repositoryUrl: string;
  branch: string;
  githubToken: string;
  committerName: string;
  committerEmail: string;
}

const DEFAULT_CONFIG: GitConfig = {
  repositoryUrl: '',
  branch: 'main',
  githubToken: '',
  committerName: '',
  committerEmail: '',
};

export const ConfigService = {
  async getGitConfig(): Promise<GitConfig> {
    try {
      const data = await fs.readFile(CONFIG_PATH, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch (error) {
      // If file doesn't exist, return default
      return DEFAULT_CONFIG;
    }
  },

  async saveGitConfig(config: GitConfig): Promise<void> {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  },

  async clearGitConfig(): Promise<void> {
    try {
      await fs.unlink(CONFIG_PATH);
    } catch (error) {
      // Ignore if not found
    }
  }
};
