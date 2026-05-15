'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ViewerPanelContextValue = {
  isObjectPropertyOpen: boolean;
  toggleObjectProperty: () => void;
  setObjectPropertyOpen: (open: boolean) => void;
};

const defaultValue: ViewerPanelContextValue = {
  isObjectPropertyOpen: true,
  toggleObjectProperty: () => {},
  setObjectPropertyOpen: () => {}
};

const ViewerPanelContext = createContext<ViewerPanelContextValue>(defaultValue);

export function ViewerPanelProvider({ children }: { children: ReactNode }) {
  const [isObjectPropertyOpen, setObjectPropertyOpen] = useState(true);
  const toggleObjectProperty = () => setObjectPropertyOpen((open) => !open);

  return (
    <ViewerPanelContext.Provider value={{ isObjectPropertyOpen, toggleObjectProperty, setObjectPropertyOpen }}>
      {children}
    </ViewerPanelContext.Provider>
  );
}

export function useViewerPanel() {
  return useContext(ViewerPanelContext);
}
