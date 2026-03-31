import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';
import { ConfigService } from '@/utils/config';

/**
 * POST /api/git/reset
 * Discards local repository changes.
 * Mode 'soft': Only undo local commits (keeps work in working tree).
 * Mode 'hard': Wipe out both local commits and uncommitted edits.
 */
export async function POST(request: Request) {
  try {
    const { mode } = await request.json();
    if (mode !== 'soft' && mode !== 'hard') {
      return NextResponse.json({ error: 'Invalid reset mode' }, { status: 400 });
    }

    const config = await ConfigService.getGitConfig();
    const branch = config.branch || 'main';

    await GitService.resetToRemote(branch, mode);
    
    return NextResponse.json({ success: true, mode });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
