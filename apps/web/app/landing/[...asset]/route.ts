import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

const landingRoot = path.resolve(process.cwd(), '..', 'landing');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

export async function GET(request: NextRequest) {
  const assetPath = decodeURIComponent(request.nextUrl.pathname.replace(/^\/landing\/?/, ''));
  const filePath = path.resolve(landingRoot, assetPath);

  if (!filePath.startsWith(landingRoot + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return new NextResponse(body, {
      headers: {
        'content-type': contentTypes[ext] ?? 'application/octet-stream'
      }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
