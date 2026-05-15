'use client';

import { useState, type KeyboardEvent } from 'react';
import styles from '../../../page.module.css';
import { baseLayerItems, thematicLayerItems, useViewerPanel, type LayerId } from '../../../_components/ViewerPanelContext';

const layerGroupIconSrc = '/assets/viewer/icons/layer-group.png?v=1';

function LayerCheckbox({
  id,
  label
}: {
  id: LayerId;
  label: string;
}) {
  const { layers, toggleLayer } = useViewerPanel();
  const checked = layers[id];

  return (
    <label className={styles.viewerLayerPanelCheck}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleLayer(id)}
        aria-label={`${label} 레이어`}
      />
      <span className={styles.viewerLayerPanelBox} aria-hidden>
        {checked ? (
          <svg viewBox="0 0 18 18" width="18" height="18" fill="none">
            <path d="M4.5 9.4 7.4 12.3 13.5 5.8" stroke="#1A1A1A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span>{label}</span>
    </label>
  );
}

function LayerGroup({
  label
}: {
  label: string;
}) {
  return (
    <button className={styles.viewerLayerPanelGroup} type="button" aria-expanded="false">
      <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden>
        <path d="m6.2 4.2 4.6 4.8-4.6 4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <img src={layerGroupIconSrc} alt="" width={21} height={21} />
      <span>{label}</span>
    </button>
  );
}

export function LayerPanel() {
  const [isOpen, setIsOpen] = useState(true);

  const handlePanelClick = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isOpen) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <aside
      className={`${styles.viewerLayerPanel} ${isOpen ? '' : styles.viewerLayerPanelCollapsed}`}
      aria-label={isOpen ? '레이어' : '레이어 패널 열기'}
      role={isOpen ? undefined : 'button'}
      tabIndex={isOpen ? undefined : 0}
      onClick={handlePanelClick}
      onKeyDown={handlePanelKeyDown}
    >
      <header className={styles.viewerLayerPanelHeader}>
        <img
          className={styles.viewerLayerPanelHeaderIcon}
          src={layerGroupIconSrc}
          alt=""
          width={28}
          height={28}
          aria-hidden
        />
        <h2 className={styles.viewerLayerPanelTitle}>레이어</h2>
        <button
          type="button"
          className={styles.viewerLayerPanelClose}
          aria-label="레이어 패널 닫기"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(false);
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className={styles.viewerLayerPanelBody} aria-hidden={!isOpen}>
        <div className={styles.viewerLayerPanelChecks}>
          {baseLayerItems.map((item) => (
            <LayerCheckbox id={item.id} label={item.label} key={item.id} />
          ))}
        </div>

        <div className={styles.viewerLayerPanelDivider} />

        <div className={styles.viewerLayerPanelGroups}>
          {thematicLayerItems.map((item) => (
            <LayerGroup label={item.label} key={item.id} />
          ))}
        </div>
      </div>
    </aside>
  );
}
