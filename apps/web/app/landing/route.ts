import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const landingRoot = path.resolve(process.cwd(), '..', 'landing');

export async function GET() {
  const html = await readFile(path.join(landingRoot, 'index.html'), 'utf8');
  const body = html.replace('<head>', '<head>\n  <base href="/landing/">');

  return new NextResponse(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8'
    }
  });
}
