'use client';

import { useState } from 'react';
import styles from '../../../page.module.css';
import {
  baseLayerItems,
  expandedThematicLayerItems,
  thematicLayerItems,
  useViewerPanel
} from '../../../_components/ViewerPanelContext';

type LayerItem = (typeof baseLayerItems)[number] | (typeof thematicLayerItems)[number] | (typeof expandedThematicLayerItems)[number];

export function LayerSlider() {
  const [isLayerSliderOpen, setIsLayerSliderOpen] = useState(false);
  const { layers, toggleLayer } = useViewerPanel();

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
            <span className={styles.layerLabel}>{item.label}</span>
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
        {renderRow([...baseLayerItems, ...thematicLayerItems])}
        {isLayerSliderOpen ? renderRow(expandedThematicLayerItems) : null}
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
