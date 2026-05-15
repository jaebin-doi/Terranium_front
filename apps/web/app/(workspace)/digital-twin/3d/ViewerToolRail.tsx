'use client';

import { useState, type SVGProps } from 'react';
import styles from '../../../page.module.css';

type ViewerToolId =
  | 'select'
  | 'pin'
  | 'measure'
  | 'measureArea'
  | 'annotate'
  | 'area';

function CursorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 4.2v14.4l3.7-3.6 2.4 5.4 2.6-1.2-2.4-5.3 5 .1L6 4.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3.4c-3.7 0-6.8 3-6.8 6.7 0 4.9 6.8 10.5 6.8 10.5s6.8-5.6 6.8-10.5c0-3.7-3.1-6.7-6.8-6.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m3.4 15.4 6-6 6-6 5.2 5.2-12 12-5.2-5.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m7.2 11.6 1.6 1.6m1.4-4.6 2.6 2.6m1.4-5.4 2.6 2.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AreaMeasureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m4.6 8.6 5-4.6 9.8 4-2.4 11.2-9.6 1.4-2.8-12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9.6" cy="4" r="1.4" fill="currentColor" />
      <circle cx="19.4" cy="8" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19.2" r="1.4" fill="currentColor" />
      <circle cx="7.4" cy="20.6" r="1.4" fill="currentColor" />
      <circle cx="4.6" cy="8.6" r="1.4" fill="currentColor" />
    </svg>
  );
}

function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 20.2h3.8L19.4 8.6a1.8 1.8 0 0 0 0-2.6l-1.4-1.4a1.8 1.8 0 0 0-2.6 0L3.8 16.2v3.8h.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m14.2 6.6 3.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AreaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5.4 5.4h13.2v13.2H5.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeDasharray="2.4 2.2"
      />
      <rect x="3.4" y="3.4" width="3.4" height="3.4" fill="currentColor" />
      <rect x="17.2" y="3.4" width="3.4" height="3.4" fill="currentColor" />
      <rect x="3.4" y="17.2" width="3.4" height="3.4" fill="currentColor" />
      <rect x="17.2" y="17.2" width="3.4" height="3.4" fill="currentColor" />
    </svg>
  );
}

const toolItems: Array<{
  id: ViewerToolId;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}> = [
  { id: 'select', label: '선택 커서', Icon: CursorIcon },
  { id: 'pin', label: '위치 핀', Icon: PinIcon },
  { id: 'measure', label: '거리 측정', Icon: RulerIcon },
  { id: 'measureArea', label: '면적 측정', Icon: AreaMeasureIcon },
  { id: 'annotate', label: '주석/마크업', Icon: PencilIcon },
  { id: 'area', label: '영역 선택', Icon: AreaIcon }
];

export function ViewerToolRail() {
  const [activeTool, setActiveTool] = useState<ViewerToolId>('measure');

  return (
    <nav
      className={styles.viewerToolRail}
      aria-label="3D 뷰어 도구"
      onMouseDown={(event) => event.stopPropagation()}
      onMouseMove={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {toolItems.map((tool) => {
        const isActive = activeTool === tool.id;
        const Icon = tool.Icon;

        return (
          <button
            key={tool.id}
            type="button"
            className={`${styles.viewerToolRailButton} ${isActive ? styles.viewerToolRailButtonActive : ''}`}
            aria-label={tool.label}
            aria-pressed={isActive}
            title={tool.label}
            onClick={() => setActiveTool(tool.id)}
          >
            <Icon aria-hidden />
          </button>
        );
      })}
    </nav>
  );
}
