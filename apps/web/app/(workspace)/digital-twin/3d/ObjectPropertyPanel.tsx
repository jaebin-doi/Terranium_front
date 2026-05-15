'use client';

import { useId, useState } from 'react';
import styles from '../../../page.module.css';

const objectPropertySections = [
  {
    title: '기본 정보',
    rows: [
      ['객체 유형', '폴리곤'],
      ['객체 ID', 'BLDG_000512'],
      ['이름', '공장 부지'],
      ['분류', '산업시설'],
      ['생성일', '2024-05-06']
    ]
  },
  {
    title: '위치',
    rows: [
      ['면적', '82,652.16 ㎡'],
      ['둘레', '1,217.54 m'],
      ['고도 (평균)', '74.32 m'],
      ['고도 (최대)', '92.18 m'],
      ['고도 (최소)', '56.47 m']
    ]
  },
  {
    title: '좌표계',
    rows: [
      ['좌표계', 'EPSG:5179'],
      ['단위', 'm']
    ]
  },
  {
    title: '속성',
    rows: [
      ['LOD', 'LOD2'],
      ['GSD', '3.5cm'],
      ['데이터 출처', 'DOI 드론 LiDAR'],
      ['포인트 수', '352,189,432'],
      ['메시 삼각형', '68,542,118']
    ]
  }
] as const;

export function ObjectPropertyPanel() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const idBase = useId();

  return (
    <aside className={styles.objectPropertyPanel} aria-label="객체 속성">
      <header className={styles.objectPropertyHeader}>
        <h2>객체 속성</h2>
        <button type="button" aria-label="객체 속성 닫기">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className={styles.objectPropertyBody}>
        {objectPropertySections.map((section, index) => {
          const isOpen = !collapsed[section.title];
          const listId = `${idBase}-${index}`;

          return (
            <section
              className={isOpen ? styles.objectPropertySection : `${styles.objectPropertySection} ${styles.objectPropertySectionCollapsed}`}
              key={section.title}
            >
              <h3>
                <button
                  type="button"
                  className={styles.objectPropertyToggle}
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  onClick={() => setCollapsed((current) => ({ ...current, [section.title]: isOpen }))}
                >
                  <svg className={isOpen ? undefined : styles.objectPropertyChevronCollapsed} viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                    <path d="m8 10 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{section.title}</span>
                </button>
              </h3>
              {isOpen ? (
                <dl id={listId}>
                  {section.rows.map(([label, value]) => (
                    <div key={`${section.title}-${label}`}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className={styles.objectPropertyFooter}>
        <button type="button">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
            <rect x="4" y="5" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 10h16M9 5v14M14 5v14" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span>속성 테이블 보기</span>
        </button>
      </div>
    </aside>
  );
}
