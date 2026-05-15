'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export const baseLayerItems = [
  { id: 'ortho', label: '정사영상', defaultChecked: false },
  { id: 'pointCloud', label: 'Point Cloud', defaultChecked: true },
  { id: 'mesh3d', label: '3D Mesh', defaultChecked: true },
  { id: 'dsmDem', label: 'DSM / DEM', defaultChecked: false }
] as const;

export const thematicLayerItems = [
  { id: 'boundary', label: '행정구역', defaultChecked: false },
  { id: 'facility', label: '시설물', defaultChecked: true },
  { id: 'traffic', label: '교통', defaultChecked: false },
  { id: 'theme', label: '기타 주제도', defaultChecked: false }
] as const;

export const expandedThematicLayerItems = [
  { id: 'contour', label: '등고선', defaultChecked: false },
  { id: 'slope', label: '경사도', defaultChecked: false },
  { id: 'vegetation', label: '식생 분포', defaultChecked: false },
  { id: 'landCover', label: '토지 피복', defaultChecked: false },
  { id: 'sunlight', label: '일조 분석', defaultChecked: false },
  { id: 'changeDetection', label: '변화 탐지', defaultChecked: false },
  { id: 'flood', label: '침수 시뮬', defaultChecked: false },
  { id: 'visibility', label: '가시권 분석', defaultChecked: false }
] as const;

export const allLayerItems = [
  ...baseLayerItems,
  ...thematicLayerItems,
  ...expandedThematicLayerItems
] as const;

export type LayerId = (typeof allLayerItems)[number]['id'];
export type LayerState = Record<LayerId, boolean>;

const initialLayerState = allLayerItems.reduce((state, item) => {
  state[item.id] = item.defaultChecked;
  return state;
}, {} as LayerState);

type ViewerPanelContextValue = {
  isObjectPropertyOpen: boolean;
  layers: LayerState;
  toggleObjectProperty: () => void;
  setObjectPropertyOpen: (open: boolean) => void;
  toggleLayer: (id: LayerId) => void;
  setLayer: (id: LayerId, enabled: boolean) => void;
};

const defaultValue: ViewerPanelContextValue = {
  isObjectPropertyOpen: true,
  layers: initialLayerState,
  toggleObjectProperty: () => {},
  setObjectPropertyOpen: () => {},
  toggleLayer: () => {},
  setLayer: () => {}
};

const ViewerPanelContext = createContext<ViewerPanelContextValue>(defaultValue);

export function ViewerPanelProvider({ children }: { children: ReactNode }) {
  const [isObjectPropertyOpen, setObjectPropertyOpen] = useState(true);
  const [layers, setLayers] = useState<LayerState>(initialLayerState);
  const toggleObjectProperty = () => setObjectPropertyOpen((open) => !open);
  const toggleLayer = (id: LayerId) => {
    setLayers((current) => ({
      ...current,
      [id]: !current[id]
    }));
  };
  const setLayer = (id: LayerId, enabled: boolean) => {
    setLayers((current) => ({
      ...current,
      [id]: enabled
    }));
  };

  return (
    <ViewerPanelContext.Provider value={{ isObjectPropertyOpen, layers, toggleObjectProperty, setObjectPropertyOpen, toggleLayer, setLayer }}>
      {children}
    </ViewerPanelContext.Provider>
  );
}

export function useViewerPanel() {
  return useContext(ViewerPanelContext);
}
