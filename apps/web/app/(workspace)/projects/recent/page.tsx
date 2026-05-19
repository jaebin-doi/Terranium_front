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

type RecentActivity = {
  time: string;
  user: string;
  action: string;
  target: string;
  result: '성공' | '검토 필요';
};

type ProjectDetail = {
  location: string;
  coordinateSystem: string;
  area: string;
  createdAt: string;
};

type DatasetStatus = {
  name: string;
  format: string;
  count: number;
};

type ProcessingStatus = {
  name: string;
  status: string;
  tone: 'complete' | 'processing' | 'waiting';
};

type GeoAiSeverity = {
  label: string;
  count: number;
  tone: 'critical' | 'high' | 'medium' | 'low';
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

const recentActivities: RecentActivity[] = [
  {
    time: '2025-05-23 10:30:15',
    user: '김미리 (Super Admin)',
    action: '프로젝트 업데이트',
    target: '울산 미포 국가산단 안전점검',
    result: '성공'
  },
  {
    time: '2025-05-23 09:58:42',
    user: '박서엽 (Manager)',
    action: 'GeoAI 분석 완료',
    target: '울산 미포 국가산단 안전점검',
    result: '성공'
  },
  {
    time: '2025-05-22 18:16:07',
    user: '이준호 (Admin)',
    action: '데이터 업로드',
    target: 'Orthomosaic_20250522.tif',
    result: '성공'
  },
  {
    time: '2025-05-22 17:45:33',
    user: '최현우 (Analyst)',
    action: '리뷰 상태 변경',
    target: 'Crack_00045',
    result: '검토 필요'
  },
  {
    time: '2025-05-22 16:32:11',
    user: '정다은 (Viewer)',
    action: '3D 뷰어 실행',
    target: '울산 미포 국가산단 안전점검',
    result: '성공'
  }
];

const projectDetailsById: Record<string, ProjectDetail> = {
  'ulsan-mipo': {
    location: '울산광역시 남구',
    coordinateSystem: 'EPSG:5179',
    area: '1.24 km²',
    createdAt: '2025-05-15'
  },
  pyeongtaek: {
    location: '경기도 평택시',
    coordinateSystem: 'EPSG:5179',
    area: '0.86 km²',
    createdAt: '2025-05-12'
  },
  'busan-port': {
    location: '부산광역시 강서구',
    coordinateSystem: 'EPSG:5179',
    area: '1.62 km²',
    createdAt: '2025-05-10'
  },
  saemangeum: {
    location: '전북특별자치도 군산시',
    coordinateSystem: 'EPSG:5179',
    area: '1.08 km²',
    createdAt: '2025-05-08'
  },
  namhae: {
    location: '경상남도 남해군',
    coordinateSystem: 'EPSG:5179',
    area: '0.32 km²',
    createdAt: '2025-05-01'
  }
};

const selectedProjectDatasets: DatasetStatus[] = [
  { name: '정사영상', format: 'Orthomosaic', count: 4 },
  { name: 'Point Cloud', format: 'LAS/LAZ', count: 2 },
  { name: '3D Mesh', format: 'OBJ/3D Tile', count: 2 },
  { name: 'DSM/DEM', format: 'GeoTIFF', count: 2 },
  { name: 'GeoAI 결과', format: 'JSON/GeoJSON', count: 6 }
];

const selectedProjectProcessing: ProcessingStatus[] = [
  { name: '정사영상 생성', status: '완료', tone: 'complete' },
  { name: '3D Mesh 생성', status: '완료', tone: 'complete' },
  { name: 'Point Cloud 처리', status: '처리 중', tone: 'processing' },
  { name: 'DSM/DEM 생성', status: '대기', tone: 'waiting' },
  { name: 'GeoAI 분석', status: '처리 중', tone: 'processing' }
];

const geoAiSeverityItems: GeoAiSeverity[] = [
  { label: 'Critical', count: 2, tone: 'critical' },
  { label: 'High', count: 11, tone: 'high' },
  { label: 'Medium', count: 25, tone: 'medium' },
  { label: 'Low', count: 87, tone: 'low' }
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
  const selectedProject = projectRows.find((project) => project.id === activeSelectedProjectId) ?? projectRows[0];
  const selectedProjectDetail = projectDetailsById[selectedProject.id] ?? projectDetailsById['ulsan-mipo'];
  const isSelectedProjectFavorite = favoriteProjectIds.has(selectedProject.id);

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

            <section className={styles.myProjectsRecentPanel} aria-labelledby="my-projects-recent-title">
              <header className={styles.myProjectsRecentHeader}>
                <h2 id="my-projects-recent-title">최근 활동</h2>
                <button type="button">
                  전체 보기
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </header>

              <div className={styles.myProjectsRecentTableWrap}>
                <table className={styles.myProjectsRecentTable}>
                  <colgroup>
                    <col className={styles.myProjectsRecentColTime} />
                    <col className={styles.myProjectsRecentColUser} />
                    <col className={styles.myProjectsRecentColAction} />
                    <col className={styles.myProjectsRecentColTarget} />
                    <col className={styles.myProjectsRecentColResult} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>시간</th>
                      <th>사용자</th>
                      <th>작업</th>
                      <th>대상</th>
                      <th>결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity) => (
                      <tr key={`${activity.time}-${activity.target}`}>
                        <td>{activity.time}</td>
                        <td>{activity.user}</td>
                        <td>{activity.action}</td>
                        <td>{activity.target}</td>
                        <td className={activity.result === '성공' ? styles.myProjectsActivitySuccess : styles.myProjectsActivityReview}>
                          {activity.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <aside className={styles.myProjectsRightColumn} aria-label="선택 프로젝트">
            <section className={styles.myProjectsDetailPanel}>
              <header className={styles.myProjectsDetailHeader}>
                <h2>선택 프로젝트</h2>
                <div className={styles.myProjectsDetailHeaderActions}>
                  <button className={styles.myProjectsDetailIconButton} type="button" aria-label="선택 프로젝트 접기">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="m7 14 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.myProjectsDetailIconButton} ${isSelectedProjectFavorite ? styles.myProjectsDetailStarActive : ''}`}
                    type="button"
                    aria-label={`${selectedProject.name} 즐겨찾기 ${isSelectedProjectFavorite ? '해제' : '추가'}`}
                    aria-pressed={isSelectedProjectFavorite}
                    onClick={() => {
                      setFavoriteProjectIds((current) => {
                        const next = new Set(current);

                        if (next.has(selectedProject.id)) {
                          next.delete(selectedProject.id);
                        } else {
                          next.add(selectedProject.id);
                        }

                        return next;
                      });
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </header>

              <div className={styles.myProjectsDetailBody}>
                <div className={styles.myProjectsDetailTitleRow}>
                  <h3>{selectedProject.name}</h3>
                  <span className={`${styles.myProjectsStatusBadge} ${styles[`myProjectsStatus_${selectedProject.statusTone}`]}`}>
                    {selectedProject.status}
                  </span>
                </div>

                <div className={styles.myProjectsDetailPreviewGrid}>
                  <div className={styles.myProjectsDetailPreview}>
                    <img src="/assets/viewer/industrial-digital-twin-scene.png" alt="" />
                  </div>

                  <dl className={styles.myProjectsDetailMeta}>
                    <div>
                      <dt>현장 유형</dt>
                      <dd>{selectedProject.siteType}</dd>
                    </div>
                    <div>
                      <dt>위치</dt>
                      <dd>{selectedProjectDetail.location}</dd>
                    </div>
                    <div>
                      <dt>좌표계</dt>
                      <dd>{selectedProjectDetail.coordinateSystem}</dd>
                    </div>
                    <div>
                      <dt>면적</dt>
                      <dd>{selectedProjectDetail.area}</dd>
                    </div>
                    <div>
                      <dt>생성일</dt>
                      <dd>{selectedProjectDetail.createdAt}</dd>
                    </div>
                    <div>
                      <dt>최근 업데이트</dt>
                      <dd>{selectedProject.updatedAt}</dd>
                    </div>
                  </dl>
                </div>

                <div className={styles.myProjectsDetailStatusGrid}>
                  <section className={styles.myProjectsDetailSubPanel} aria-labelledby="my-projects-datasets-title">
                    <header>
                      <h3 id="my-projects-datasets-title">데이터셋 현황</h3>
                      <span>전체 {selectedProject.datasets}</span>
                    </header>
                    <ul>
                      {selectedProjectDatasets.map((dataset) => (
                        <li key={dataset.name}>
                          <span className={styles.myProjectsDetailBullet} />
                          <strong>{dataset.name}</strong>
                          <em>{dataset.format}</em>
                          <b>{dataset.count}</b>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.myProjectsDetailSubPanel} aria-labelledby="my-projects-processing-title">
                    <header>
                      <h3 id="my-projects-processing-title">처리 작업 현황</h3>
                      <span>전체 5</span>
                    </header>
                    <ul>
                      {selectedProjectProcessing.map((process) => (
                        <li key={process.name}>
                          <strong>{process.name}</strong>
                          <b className={styles[`myProjectsProcess_${process.tone}`]}>{process.status}</b>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className={styles.myProjectsGeoAiPanel} aria-labelledby="my-projects-geoai-title">
                  <h3 id="my-projects-geoai-title">GeoAI 요약 (Road Damage Detection)</h3>

                  <div className={styles.myProjectsGeoAiContent}>
                    <dl className={styles.myProjectsGeoAiStats}>
                      <div>
                        <dt>전체 리뷰</dt>
                        <dd>128</dd>
                      </div>
                      <div>
                        <dt>검토 필요</dt>
                        <dd>5</dd>
                      </div>
                    </dl>

                    <div className={styles.myProjectsGeoAiDonut} aria-label="GeoAI 리뷰 심각도 요약">
                      <div>
                        <strong>128</strong>
                        <span>Total</span>
                      </div>
                    </div>

                    <ul className={styles.myProjectsGeoAiLegend}>
                      {geoAiSeverityItems.map((item) => (
                        <li key={item.label}>
                          <span className={styles[`myProjectsSeverity_${item.tone}`]} />
                          <em>{item.label}</em>
                          <b>{item.count}</b>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.myProjectsDetailCtas}>
                    <button type="button" onClick={() => router.push('/digital-twin/3d')}>
                      3D 뷰어 열기
                    </button>
                    <button type="button">
                      보고서 생성
                    </button>
                  </div>
                </section>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
