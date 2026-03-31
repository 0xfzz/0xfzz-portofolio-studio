import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';
import { ConfigService } from '@/utils/config';

/**
 * POST /api/git/commit
 * Stages, commits, and pushes changes.
 */
export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Commit message is required' }, { status: 400 });
    }

    const config = await ConfigService.getGitConfig();
    const branch = config.branch || 'main';

    await GitService.setRemote(config.repositoryUrl, config.githubToken)
    await GitService.setIdentity(config.committerName, config.committerEmail)
    
    const result = await GitService.commitAndPush(message, branch);
    const status = await GitService.getStatus();
    return NextResponse.json({ success: true, result, status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
