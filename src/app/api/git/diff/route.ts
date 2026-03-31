import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';
import { ConfigService } from '@/utils/config';

/**
 * GET /api/git/diff
 * Returns a categorized list of changed files and their raw diffs.
 * Includes: 
 * - local: Draft changes (uncommitted)
 * - unpushed: Local commits (unpushed)
 * - synced: Last 5 pushed commits (for context)
 */
export async function GET() {
  try {
    const config = await ConfigService.getGitConfig();
    const branch = config.branch || 'main';

    const { local, unpushed, synced } = await GitService.getCategorizedDiff(branch);
    
    // Get diffs for local files (Draft)
    const localWithDiffs = await Promise.all(local.map(async (f) => ({
      ...f,
      raw: await GitService.getFileDiff(f.file, branch, 'LOCAL')
    })));

    // Get diffs for unpushed commits (Total delta since remote)
    const unpushedWithDiffs = await Promise.all(unpushed.map(async (f) => ({
      ...f,
      raw: await GitService.getFileDiff(f.file, branch, 'UNPUSHED')
    })));

    return NextResponse.json({ 
      local: localWithDiffs, 
      unpushed: unpushedWithDiffs, 
      synced 
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
