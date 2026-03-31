import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';
import { ConfigService } from '@/utils/config';

/**
 * GET | POST /api/git/sync
 * Pulls the latest changes from the remote origin on the configured branch.
 */
async function handleSync() {
  try {
    const config = await ConfigService.getGitConfig();
    const branch = config.branch || 'main';

    await GitService.setRemote(config.repositoryUrl, config.githubToken)
    await GitService.setIdentity(config.committerName, config.committerEmail)
    const syncResult = await GitService.sync(branch);
    const status = await GitService.getStatus();
    
    return NextResponse.json({ success: true, result: syncResult, status, branch });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export { handleSync as GET, handleSync as POST };
