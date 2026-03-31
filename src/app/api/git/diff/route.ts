import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';

/**
 * GET /api/git/diff
 * Returns a list of changed files and their raw diffs.
 */
export async function GET() {
  try {
    const files = await GitService.getDiff();
    
    // For each file, get the raw diff
    const diffs = await Promise.all(
      files.map(async (f: any) => {
        const raw = await GitService.getFileDiff(f.file);
        return {
          filename: f.file,
          type: f.type,
          raw
        };
      })
    );

    return NextResponse.json({ files: diffs });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
