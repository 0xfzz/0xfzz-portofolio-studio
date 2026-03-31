import { NextResponse } from 'next/server';
import { GitService } from '@/utils/git';

/**
 * GET /api/git/status
 * Lightweight check of local repository status (clean/dirty).
 * Does NOT hit the network (no fetch/pull).
 */
export async function GET() {
  try {
    const statusData = await GitService.getStatus();
    return NextResponse.json(statusData);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
