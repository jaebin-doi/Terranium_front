'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminChrome, getWorkspaceChromeProps } from '../_components/AdminChrome';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const props = getWorkspaceChromeProps(pathname);
  return <AdminChrome {...props}>{children}</AdminChrome>;
}
