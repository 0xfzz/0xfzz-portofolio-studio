import { NextResponse } from 'next/server';
import { ConfigService, GitConfig } from '@/utils/config';
import { GitService } from '@/utils/git';

/**
 * GET /api/git/config
 * Returns current configuration (masking token).
 */
export async function GET() {
  const config = await ConfigService.getGitConfig();
  
  // Return safe version
  return NextResponse.json({
    ...config,
    githubToken: config.githubToken ? `ghp_${"*".repeat(30)}` : ''
  });
}

/**
 * POST /api/git/config
 * Updates configuration and re-configures the local repository.
 */
export async function POST(req: Request) {
  try {
    const config: GitConfig = await req.json();
    const existing = await ConfigService.getGitConfig();

    // Use existing token if the incoming one is masked
    const finalToken = (config.githubToken && config.githubToken.includes('***')) 
      ? existing.githubToken 
      : config.githubToken;

    const finalConfig = { ...config, githubToken: finalToken };

    // 1. Persist
    await ConfigService.saveGitConfig(finalConfig);

    // 2. Apply to Git binary
    if (finalConfig.repositoryUrl) {
      await GitService.setRemote(finalConfig.repositoryUrl, finalConfig.githubToken);
    }
    
    if (finalConfig.committerName && finalConfig.committerEmail) {
      await GitService.setIdentity(finalConfig.committerName, finalConfig.committerEmail);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/git/config
 * Clears local configuration.
 */
export async function DELETE() {
  await ConfigService.clearGitConfig();
  return NextResponse.json({ success: true });
}
