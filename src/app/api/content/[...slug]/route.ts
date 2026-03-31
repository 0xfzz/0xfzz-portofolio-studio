import { NextResponse } from 'next/server';
import { FSService } from '@/utils/fs';

// Opt out of caching so GET always returns fresh file content after a POST
export const dynamic = 'force-dynamic';

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
      if (pathPart.endsWith('.md')) {
        const content = await FSService.readMarkdown(pathPart);
        return new NextResponse(content, { headers: { 'Content-Type': 'text/markdown' } });
      }
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
    return NextResponse.json(
      { error: (error as Error).message, contentRoot: FSService.contentRoot },
      { status: 404 }
    );
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
  const lastPart = slug[slug.length - 1];
  const isMd = lastPart.endsWith('.md');
  const filePath = slug.join('/') + (isMd || lastPart.endsWith('.json') ? '' : '.json');
  const resolvedPath = FSService.resolvePath(filePath);

  try {
    if (filePath.endsWith('.md')) {
      const { content } = await request.json();
      await FSService.writeMarkdown(filePath, content);
      return NextResponse.json({ success: true, path: filePath, resolvedPath });
    }
    const body = await request.json();
    await FSService.writeJson(filePath, body);
    return NextResponse.json({ success: true, path: filePath, resolvedPath });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, path: filePath, resolvedPath, contentRoot: FSService.contentRoot },
      { status: 500 }
    );
  }
}
