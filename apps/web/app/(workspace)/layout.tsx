'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminChrome, getWorkspaceChromeProps } from '../_components/AdminChrome';
import { ViewerPanelProvider } from '../_components/ViewerPanelContext';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const props = getWorkspaceChromeProps(pathname);
  return (
    <ViewerPanelProvider>
      <AdminChrome {...props}>{children}</AdminChrome>
    </ViewerPanelProvider>
  );
}
