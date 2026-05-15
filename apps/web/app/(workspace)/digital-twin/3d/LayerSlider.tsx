'use client';

import { useState } from 'react';
import styles from '../../../page.module.css';

const baseLayerItems = [
  { id: 'ortho', label: '정사영상', defaultChecked: false },
  { id: 'pointCloud', label: 'Point Cloud', defaultChecked: true },
  { id: 'mesh3d', label: '3D Mesh', defaultChecked: true },
  { id: 'dsmDem', label: 'DSM / DEM', defaultChecked: false },
  { id: 'boundary', label: '행정구역', defaultChecked: false },
  { id: 'facility', label: '시설물', defaultChecked: true },
  { id: 'traffic', label: '교통', defaultChecked: false },
  { id: 'theme', label: '기타 주제도', defaultChecked: false }
] as const;

const thematicLayerItems = [
  { id: 'contour', label: '등고선', defaultChecked: false },
  { id: 'slope', label: '경사도', defaultChecked: false },
  { id: 'vegetation', label: '식생 분포', defaultChecked: false },
  { id: 'landCover', label: '토지 피복', defaultChecked: false },
  { id: 'sunlight', label: '일조 분석', defaultChecked: false },
  { id: 'changeDetection', label: '변화 탐지', defaultChecked: false },
  { id: 'flood', label: '침수 시뮬', defaultChecked: false },
  { id: 'visibility', label: '가시권 분석', defaultChecked: false }
] as const;

const allLayerItems = [...baseLayerItems, ...thematicLayerItems];

type LayerState = Record<(typeof allLayerItems)[number]['id'], boolean>;

const initialLayerState = allLayerItems.reduce((state, item) => {
  state[item.id] = item.defaultChecked;
  return state;
}, {} as LayerState);

type LayerItem = (typeof allLayerItems)[number];

export function LayerSlider() {
  const [layers, setLayers] = useState<LayerState>(initialLayerState);
  const [isLayerSliderOpen, setIsLayerSliderOpen] = useState(false);

  const toggleLayer = (id: keyof LayerState) => {
    setLayers((current) => ({
      ...current,
      [id]: !current[id]
    }));
  };

  const renderRow = (items: readonly LayerItem[]) => (
    <div className={styles.layerSliderItems}>
      {items.map((item) => {
        const checked = layers[item.id];

        return (
          <label className={styles.layerToggle} key={item.id}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleLayer(item.id)}
              aria-label={`${item.label} 레이어`}
            />
            <span className={styles.layerCheck} aria-hidden>
              {checked ? (
                <svg viewBox="0 0 18 18" width="18" height="18" fill="none">
                  <path d="M4.5 9.5L7.5 12.5L13.5 5.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </span>
            <span>{item.label}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <footer
      className={`${styles.layerSlider} ${isLayerSliderOpen ? styles.layerSliderOpen : ''}`}
      aria-label="레이어 슬라이더"
    >
      <div className={styles.layerSliderTitle}>레이어 슬라이더</div>

      <div className={styles.layerSliderBody}>
        {renderRow(baseLayerItems)}
        {isLayerSliderOpen ? renderRow(thematicLayerItems) : null}
      </div>

      <div className={styles.layerSliderActions}>
        <button type="button" aria-label="레이어 설정">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M9.7 4.2a2.3 2.3 0 0 1 4.6 0 2.3 2.3 0 0 0 3.2 1.9 2.3 2.3 0 0 1 2.3 4 2.3 2.3 0 0 0 0 3.8 2.3 2.3 0 0 1-2.3 4 2.3 2.3 0 0 0-3.2 1.9 2.3 2.3 0 0 1-4.6 0 2.3 2.3 0 0 0-3.2-1.9 2.3 2.3 0 0 1-2.3-4 2.3 2.3 0 0 0 0-3.8 2.3 2.3 0 0 1 2.3-4 2.3 2.3 0 0 0 3.2-1.9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={isLayerSliderOpen ? '레이어 슬라이더 접기' : '레이어 슬라이더 펼치기'}
          aria-expanded={isLayerSliderOpen}
          onClick={() => setIsLayerSliderOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              d={isLayerSliderOpen ? 'm7 10 5 5 5-5' : 'm7 14 5-5 5 5'}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
