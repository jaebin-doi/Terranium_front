'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../../../page.module.css';

type ProjectStat = {
  label: string;
  value: string;
  unit?: string;
  tone?: 'default' | 'danger';
  icon: 'projects' | 'active' | 'warning' | 'datasets' | 'storage';
};

const projectStats: ProjectStat[] = [
  { label: '전체 프로젝트', value: '12', icon: 'projects' },
  { label: '활성', value: '8', icon: 'active' },
  { label: '검토 필요', value: '27', tone: 'danger', icon: 'warning' },
  { label: '데이터셋', value: '64', icon: 'datasets' },
  { label: '저장소', value: '842.5', unit: 'GB', icon: 'storage' }
];

const projectTabs = ['전체', '활성', '처리 중', '검토 필요', '보관'] as const;

const projectFilters = [
  { label: '상태', options: ['전체', '활성', '처리 중', '검토 필요', '보관'] },
  { label: '현장 유형', options: ['전체', '산업시설', '항만시설', '교량/도로'] },
  { label: '최근 업데이트', options: ['최근 업데이트', '오래된 순', '프로젝트명'] }
] as const;

type ProjectRow = {
  id: string;
  name: string;
  site: string;
  siteType: string;
  status: (typeof projectTabs)[number];
  statusTone: 'active' | 'processing' | 'review' | 'archived';
  datasets: number;
  reviewCount: number;
  updatedAt: string;
};

const projectRows: ProjectRow[] = [
  {
    id: 'ulsan-mipo',
    name: '울산 미포 국가산단 안전점검',
    site: '울산 미포 국가산업단지',
    siteType: '산업시설',
    status: '활성',
    statusTone: 'active',
    datasets: 16,
    reviewCount: 5,
    updatedAt: '2025-05-23 10:30'
  },
  {
    id: 'pyeongtaek',
    name: '평택 산업시설 균열 분석',
    site: '평택 포승 산업단지',
    siteType: '산업시설',
    status: '처리 중',
    statusTone: 'processing',
    datasets: 12,
    reviewCount: 8,
    updatedAt: '2025-05-21 16:45'
  },
  {
    id: 'busan-port',
    name: '부산항 항만시설 3D 측량',
    site: '부산항 신항 4부두',
    siteType: '항만시설',
    status: '검토 필요',
    statusTone: 'review',
    datasets: 18,
    reviewCount: 12,
    updatedAt: '2025-05-20 09:15'
  },
  {
    id: 'saemangeum',
    name: '새만금 산업단지 정사영상',
    site: '새만금 국가산업단지',
    siteType: '산업시설',
    status: '활성',
    statusTone: 'active',
    datasets: 8,
    reviewCount: 0,
    updatedAt: '2025-05-18 14:22'
  },
  {
    id: 'namhae',
    name: '남해 교량 안전진단',
    site: '남해 창선대교',
    siteType: '교량/도로',
    status: '보관',
    statusTone: 'archived',
    datasets: 10,
    reviewCount: 2,
    updatedAt: '2025-05-10 11:03'
  }
];

function ProjectStatIcon({ icon }: { icon: ProjectStat['icon'] }) {
  if (icon === 'projects') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden>
        <rect x="3.5" y="5" width="21" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <path d="M8 11h4.2M8 17h4.2M16 11h4M16 17h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M12.2 8.2 15 5h5.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === 'active') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden>
        <circle cx="16" cy="16" r="2.2" fill="currentColor" />
        <circle cx="16" cy="4.8" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="26" cy="10.8" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="26" cy="21.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="27.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="21.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="10.8" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 7v7M24.2 12.1 18 15M24.2 19.9 18 17M16 18.5v6.2M7.8 19.9 14 17M7.8 12.1 14 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'warning') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M16 5.2 28 26H4L16 5.2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 12.2v7.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="23.2" r="1.25" fill="currentColor" />
      </svg>
    );
  }

  if (icon === 'datasets') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="m16 4.5 10 5.2-10 5.2-10-5.2 10-5.2Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="m6 15.3 10 5.2 10-5.2M6 21l10 5.2L26 21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <ellipse cx="16" cy="8" rx="8.5" ry="4" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M7.5 8v7.8c0 2.2 3.8 4 8.5 4s8.5-1.8 8.5-4V8" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M7.5 15.8v7.1c0 2.2 3.8 4 8.5 4s8.5-1.8 8.5-4v-7.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function MyProjectsFilterSelect({
  label,
  options
}: {
  label: string;
  options: readonly string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(label);
  const listboxId = useId();

  return (
    <div
      className={styles.myProjectsFilterWrap}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        className={styles.myProjectsFilterButton}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className={styles.myProjectsFilterMenu} id={listboxId} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              className={`${styles.myProjectsFilterOption} ${option === value ? styles.myProjectsFilterOptionActive : ''}`}
              type="button"
              role="option"
              aria-selected={option === value}
              key={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setValue(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function RecentProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof projectTabs)[number]>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState(projectRows[0].id);
  const [openActionProjectId, setOpenActionProjectId] = useState<string | null>(null);
  const [openViewerProjectId, setOpenViewerProjectId] = useState<string | null>(null);
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<Set<string>>(() => new Set());
  const visibleProjects = activeTab === '전체' ? projectRows : projectRows.filter((project) => project.status === activeTab);
  const activeSelectedProjectId = visibleProjects.some((project) => project.id === selectedProjectId)
    ? selectedProjectId
    : visibleProjects[0]?.id;

  useEffect(() => {
    if (!openActionProjectId && !openViewerProjectId) return;

    const closeOpenMenus = () => {
      setOpenActionProjectId(null);
      setOpenViewerProjectId(null);
    };
    const closeOpenMenusWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOpenMenus();
      }
    };

    document.addEventListener('click', closeOpenMenus);
    document.addEventListener('keydown', closeOpenMenusWithEscape);

    return () => {
      document.removeEventListener('click', closeOpenMenus);
      document.removeEventListener('keydown', closeOpenMenusWithEscape);
    };
  }, [openActionProjectId, openViewerProjectId]);

  return (
    <section className={styles.workspace} aria-label="내 프로젝트">
      <div className={styles.myProjectsWorkspace}>
        <div className={styles.myProjectsSummaryGrid} aria-label="프로젝트 요약 통계">
          {projectStats.map((stat) => (
            <article className={styles.myProjectsStatCard} key={stat.label}>
              <div className={styles.myProjectsStatText}>
                <h2>{stat.label}</h2>
                <strong className={stat.tone === 'danger' ? styles.myProjectsStatValueDanger : undefined}>
                  {stat.value}
                  {stat.unit ? <span>{stat.unit}</span> : null}
                </strong>
              </div>
              <div className={`${styles.myProjectsStatIcon} ${styles[`myProjectsStatIcon_${stat.icon}`]}`}>
                <ProjectStatIcon icon={stat.icon} />
              </div>
            </article>
          ))}
        </div>

        <div className={styles.myProjectsMainGrid}>
          <div className={styles.myProjectsLeftColumn}>
            <div className={styles.myProjectsControlsRow} aria-label="프로젝트 목록 필터">
              <div className={styles.myProjectsTabs} role="tablist" aria-label="프로젝트 상태 탭">
                {projectTabs.map((tab) => {
                  const isActive = activeTab === tab;

                  return (
                  <button
                    className={`${styles.myProjectsTab} ${isActive ? styles.myProjectsTabActive : ''}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                  );
                })}
              </div>

              <label className={styles.myProjectsSearchBox}>
                <span className={styles.myProjectsSearchLabel}>검색</span>
                <input type="search" placeholder="검색" aria-label="프로젝트 검색" />
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="m16.2 16.2 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </label>

              <div className={styles.myProjectsFilterGroup} aria-label="프로젝트 필터">
                {projectFilters.map((filter) => (
                  <MyProjectsFilterSelect label={filter.label} options={filter.options} key={filter.label} />
                ))}
              </div>

              <button className={styles.myProjectsRefreshButton} type="button" aria-label="새로고침">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 4v6h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <section className={styles.myProjectsTablePanel} aria-labelledby="my-projects-table-title">
              <header className={styles.myProjectsPanelHeader}>
                <h2 id="my-projects-table-title">프로젝트 목록</h2>
              </header>

              <div className={styles.myProjectsTableWrap}>
                <table className={styles.myProjectsTable}>
                  <colgroup>
                    <col className={styles.myProjectsColFavorite} />
                    <col className={styles.myProjectsColName} />
                    <col className={styles.myProjectsColSite} />
                    <col className={styles.myProjectsColType} />
                    <col className={styles.myProjectsColStatus} />
                    <col className={styles.myProjectsColNumber} />
                    <col className={styles.myProjectsColNumber} />
                    <col className={styles.myProjectsColUpdated} />
                    <col className={styles.myProjectsColActions} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th aria-label="즐겨찾기" />
                      <th>프로젝트명</th>
                      <th>현장명</th>
                      <th>현장 유형</th>
                      <th>상태</th>
                      <th>데이터셋</th>
                      <th>검토 필요</th>
                      <th>최근 업데이트</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProjects.map((project) => {
                      const isSelected = project.id === activeSelectedProjectId;

                      return (
                        <tr
                          className={isSelected ? styles.myProjectsRowSelected : undefined}
                          aria-selected={isSelected}
                          key={project.id}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setOpenActionProjectId(null);
                          }}
                        >
                          <td>
                            {(() => {
                              const isFavorite = favoriteProjectIds.has(project.id);

                              return (
                            <button
                              className={`${styles.myProjectsIconButton} ${isFavorite ? styles.myProjectsFavoriteActive : ''}`}
                              type="button"
                              aria-label={`${project.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
                              aria-pressed={isFavorite}
                              onClick={(event) => {
                                event.stopPropagation();
                                setFavoriteProjectIds((current) => {
                                  const next = new Set(current);

                                  if (next.has(project.id)) {
                                    next.delete(project.id);
                                  } else {
                                    next.add(project.id);
                                  }

                                  return next;
                                });
                              }}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden>
                                <path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                              </svg>
                            </button>
                              );
                            })()}
                          </td>
                          <td>{project.name}</td>
                          <td>{project.site}</td>
                          <td>{project.siteType}</td>
                          <td>
                            <span className={`${styles.myProjectsStatusBadge} ${styles[`myProjectsStatus_${project.statusTone}`]}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>{project.datasets}</td>
                          <td className={project.reviewCount > 0 ? styles.myProjectsReviewCount : styles.myProjectsReviewCountZero}>
                            {project.reviewCount}
                          </td>
                          <td>{project.updatedAt}</td>
                          <td>
                            <div className={styles.myProjectsTableActions}>
                              <button
                                className={styles.myProjectsIconButton}
                                type="button"
                                aria-label={`${project.name} 열기`}
                                aria-haspopup="menu"
                                aria-expanded={openViewerProjectId === project.id}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenActionProjectId(null);
                                  setOpenViewerProjectId((current) => (current === project.id ? null : project.id));
                                }}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden>
                                  <path d="M14 5h5v5M19 5 10 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                              </button>
                              {openViewerProjectId === project.id ? (
                                <div
                                  className={`${styles.myProjectsActionMenu} ${styles.myProjectsViewerMenu}`}
                                  role="menu"
                                  aria-label={`${project.name} 뷰어 선택`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button type="button" role="menuitem" onClick={() => router.push('/digital-twin/3d')}>
                                    3D 디지털 트윈
                                  </button>
                                  <button type="button" role="menuitem" onClick={() => router.push('/digital-twin/2d')}>
                                    2D 지도
                                  </button>
                                </div>
                              ) : null}
                              <button
                                className={styles.myProjectsIconButton}
                                type="button"
                                aria-label={`${project.name} 더보기`}
                                aria-haspopup="menu"
                                aria-expanded={openActionProjectId === project.id}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenViewerProjectId(null);
                                  setOpenActionProjectId((current) => (current === project.id ? null : project.id));
                                }}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden>
                                  <circle cx="12" cy="5" r="1.8" fill="currentColor" />
                                  <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                                  <circle cx="12" cy="19" r="1.8" fill="currentColor" />
                                </svg>
                              </button>
                              {openActionProjectId === project.id ? (
                                <div
                                  className={styles.myProjectsActionMenu}
                                  role="menu"
                                  aria-label={`${project.name} 작업 메뉴`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {['상세 정보', '공유 설정', '보관'].map((action) => (
                                    <button type="button" role="menuitem" key={action}>
                                      {action}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <footer className={styles.myProjectsTableFooter}>
                <p className={styles.myProjectsResultCount}>
                  총 {visibleProjects.length}개 중 {visibleProjects.length > 0 ? 1 : 0}-{visibleProjects.length}개 표시
                </p>

                <div className={styles.myProjectsPagination} aria-label="프로젝트 목록 페이지">
                  <button type="button" aria-label="이전 페이지">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      className={page === currentPage ? styles.myProjectsCurrentPage : undefined}
                      type="button"
                      aria-current={page === currentPage ? 'page' : undefined}
                      onClick={() => setCurrentPage(page)}
                      key={page}
                    >
                      {page}
                    </button>
                  ))}
                  <button type="button" aria-label="다음 페이지">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <label className={styles.myProjectsPageSizeControl}>
                  <span>페이지 크기</span>
                  <select className={styles.myProjectsPageSizeSelect} defaultValue="10">
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                  </select>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </label>
              </footer>
            </section>
          </div>
          <aside className={styles.myProjectsRightColumn} aria-label="선택 프로젝트" />
        </div>
      </div>
    </section>
  );
}
