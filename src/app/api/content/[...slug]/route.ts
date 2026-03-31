import { NextResponse } from 'next/server';
import { FSService } from '@/utils/fs';

/**
 * GET /api/content/[...slug]
 * Fetches content from the frontend content directory.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const pathPart = slug.join('/');
  const isExplicitFile = pathPart.endsWith('.json') || pathPart.endsWith('.md');

  try {
    if (isExplicitFile) {
      const data = await FSService.readJson(pathPart);
      return NextResponse.json(data);
    }

    // Check if the path resolves to a directory
    const isDir = await FSService.isDirectory(pathPart);
    if (isDir) {
      const list = await FSService.readDirectory(pathPart);
      return NextResponse.json(list);
    }

    // Fall back to reading as a .json file
    const data = await FSService.readJson(pathPart + '.json');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 });
  }
}

/**
 * POST /api/content/[...slug]
 * Saves content back to the frontend content directory.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filePath = slug.join('/') + (slug[slug.length - 1].endsWith('.json') ? '' : '.json');

  try {
    const body = await request.json();
    await FSService.writeJson(filePath, body);
    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
