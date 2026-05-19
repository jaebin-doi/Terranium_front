'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../../../page.module.css';

type ProjectStat = {
  label: string;
  value: string;
  unit?: string;
  tone?: 'blue' | 'yellow' | 'cyan' | 'danger';
  icon: string;
  iconAlt: string;
};

const projectStats: ProjectStat[] = [
  { label: '공유 프로젝트', value: '7', tone: 'blue', icon: 'shared-projects', iconAlt: '공유 프로젝트' },
  { label: '초대 대기', value: '3', tone: 'yellow', icon: 'pending-invites', iconAlt: '초대 대기' },
  { label: '외부 기관', value: '5', tone: 'cyan', icon: 'external-organizations', iconAlt: '외부 기관' },
  { label: '검토 요청', value: '18', tone: 'danger', icon: 'review-requests', iconAlt: '검토 요청' },
  { label: '만료 예정', value: '2', tone: 'yellow', icon: 'expiring-soon', iconAlt: '만료 예정' }
];

const projectTabs = ['전체', '내가 검토', '편집 가능', '조회 전용', '초대 대기'] as const;

const projectFilters = [
  { label: '소유 기관', options: ['소유 기관', '부산항만공사', '평택시', '한국도로공사', '서울시'] },
  { label: '내 역할', options: ['내 역할', '검토자', '편집자', '조회자', '분석가'] },
  { label: '권한', options: ['권한', '의견', '편집', '조회', '분석'] },
  { label: '최근 활동', options: ['최근 활동', '오래된 순', '공유일'] }
] as const;

type ProjectRow = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  owner: string;
  role: '검토자' | '편집자' | '조회자' | '분석가';
  roleTone: 'reviewer' | 'editor' | 'viewer' | 'analyst';
  permission: '의견' | '편집' | '조회' | '분석';
  status: '활성';
  tab: (typeof projectTabs)[number];
  reviewCount: number;
  sharedAt: string;
  recentActivity: string;
};

type RecentActivity = {
  time: string;
  user: string;
  action: string;
  target: string;
  result: '성공' | '검토 필요';
};

type ProjectDetail = {
  permissionLabel: string;
  expiresAt: string;
  expiresRemain: string;
};

type SharedMember = {
  name: string;
  organization: string;
  role: ProjectRow['role'];
  roleTone: ProjectRow['roleTone'];
  view: boolean;
  edit: boolean;
  review: boolean;
  report: boolean;
};

type PendingInvite = {
  contact: string;
  invitedAt: string;
  expiresAt: string;
  status: '대기';
};

const projectRows: ProjectRow[] = [
  {
    id: 'busan-port-shared',
    name: '부산항 항만시설 공동 검수',
    category: '항만 · 인프라',
    thumbnail: '/assets/viewer/industrial-digital-twin-scene.png',
    owner: '부산항만공사',
    role: '검토자',
    roleTone: 'reviewer',
    permission: '의견',
    status: '활성',
    tab: '내가 검토',
    reviewCount: 6,
    sharedAt: '2025-05-20',
    recentActivity: '2시간 전'
  },
  {
    id: 'pyeongtaek-shared',
    name: '평택 스마트 안전산단',
    category: '산업단지 · 안전',
    thumbnail: '/assets/viewer/industrial-digital-twin-scene.png',
    owner: '평택시',
    role: '편집자',
    roleTone: 'editor',
    permission: '편집',
    status: '활성',
    tab: '편집 가능',
    reviewCount: 5,
    sharedAt: '2025-05-18',
    recentActivity: '5시간 전'
  },
  {
    id: 'namhae-bridge-shared',
    name: '남해 교량 합동 안전진단',
    category: '교량 · 시설물',
    thumbnail: '/assets/viewer/industrial-digital-twin-scene.png',
    owner: '경상남도',
    role: '조회자',
    roleTone: 'viewer',
    permission: '조회',
    status: '활성',
    tab: '조회 전용',
    reviewCount: 2,
    sharedAt: '2025-05-15',
    recentActivity: '1일 전'
  },
  {
    id: 'saemangeum-shared',
    name: '새만금 산업단지 공동 분석',
    category: '산업단지 · 분석',
    thumbnail: '/assets/viewer/industrial-digital-twin-scene.png',
    owner: '한국도로공사',
    role: '분석가',
    roleTone: 'analyst',
    permission: '분석',
    status: '활성',
    tab: '편집 가능',
    reviewCount: 3,
    sharedAt: '2025-05-14',
    recentActivity: '2일 전'
  },
  {
    id: 'seoul-infra-shared',
    name: '도심 인프라 정기 점검',
    category: '도시 · 인프라',
    thumbnail: '/assets/viewer/industrial-digital-twin-scene.png',
    owner: '서울시',
    role: '검토자',
    roleTone: 'reviewer',
    permission: '의견',
    status: '활성',
    tab: '내가 검토',
    reviewCount: 2,
    sharedAt: '2025-05-12',
    recentActivity: '2일 전'
  }
];

const recentActivities: RecentActivity[] = [
  { time: '2025-05-23 10:18:32', user: '김민리', action: '검토 의견 추가', target: '교량_균열_구간_05', result: '성공' },
  { time: '2025-05-23 09:55:11', user: '이준호', action: '데이터 업로드', target: '항만_정사영상_250523', result: '성공' },
  { time: '2025-05-23 09:12:45', user: '최현우', action: '분석 결과 공유', target: '침식_변화_분석_250523', result: '성공' },
  { time: '2025-05-22 16:40:07', user: '정다운', action: '보고서 초안 업로드', target: '주간_검수보고서_v0.3', result: '검토 필요' },
  { time: '2025-05-22 15:22:33', user: '홍길동', action: '프로젝트 초대 수락', target: '-', result: '성공' }
];

const projectDetailsById: Record<string, ProjectDetail> = {
  'busan-port-shared': {
    permissionLabel: 'Comment',
    expiresAt: '2025-11-20',
    expiresRemain: 'D-181'
  },
  'pyeongtaek-shared': {
    permissionLabel: 'Edit',
    expiresAt: '2025-11-18',
    expiresRemain: 'D-179'
  },
  'namhae-bridge-shared': {
    permissionLabel: 'Read',
    expiresAt: '2025-11-15',
    expiresRemain: 'D-176'
  },
  'saemangeum-shared': {
    permissionLabel: 'Analyze',
    expiresAt: '2025-11-14',
    expiresRemain: 'D-175'
  },
  'seoul-infra-shared': {
    permissionLabel: 'Comment',
    expiresAt: '2025-11-12',
    expiresRemain: 'D-173'
  }
};

const sharedMembers: SharedMember[] = [
  { name: '박서연', organization: '부산항만공사', role: '조회자', roleTone: 'viewer', view: true, edit: true, review: true, report: false },
  { name: '김민리 (나)', organization: 'DOI', role: '검토자', roleTone: 'reviewer', view: true, edit: false, review: true, report: false },
  { name: '이준호', organization: '부산항만공사', role: '편집자', roleTone: 'editor', view: true, edit: true, review: true, report: true },
  { name: '최현우', organization: '한국해양대', role: '분석가', roleTone: 'analyst', view: false, edit: true, review: true, report: false },
  { name: '정다운', organization: '부산시', role: '조회자', roleTone: 'viewer', view: true, edit: false, review: false, report: false },
  { name: '홍길동', organization: '외부 전문가', role: '검토자', roleTone: 'reviewer', view: true, edit: false, review: true, report: false }
];

const pendingInvites: PendingInvite[] = [
  { contact: '김지훈 / gimjh@busanpa.or.kr', invitedAt: '2025-05-21', expiresAt: '2025-06-04', status: '대기' },
  { contact: '이수진 / sujin.lee@bsi.re.kr', invitedAt: '2025-05-20', expiresAt: '2025-06-03', status: '대기' }
];

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

function PermissionIcon({ type }: { type: ProjectRow['permission'] }) {
  if (type === '편집') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m14.5 5.5 4 4L8.8 19.2H5v-3.8L14.5 5.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m13 7 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === '조회') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === '분석') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 19V9M9.5 19V5M15 19v-7M20 19V8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 19h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M7 8.5h10M7 12h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 5.5h15v10.2h-7.3L8 19.1v-3.4H4.5V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function SharedProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof projectTabs)[number]>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState(projectRows[0].id);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const visibleProjects = activeTab === '전체' ? projectRows : projectRows.filter((project) => project.tab === activeTab);
  const activeSelectedProjectId = visibleProjects.some((project) => project.id === selectedProjectId)
    ? selectedProjectId
    : visibleProjects[0]?.id;
  const selectedProject = projectRows.find((project) => project.id === activeSelectedProjectId) ?? projectRows[0];
  const selectedProjectDetail = projectDetailsById[selectedProject.id] ?? projectDetailsById['busan-port-shared'];

  return (
    <section className={styles.workspace} aria-label="공유된 프로젝트">
      <div className={styles.myProjectsWorkspace}>
        <div className={styles.myProjectsSummaryGrid} aria-label="프로젝트 요약 통계">
          {projectStats.map((stat) => (
            <article className={styles.myProjectsStatCard} key={stat.label}>
              <div className={styles.myProjectsStatText}>
                <h2>{stat.label}</h2>
                <strong className={stat.tone ? styles[`sharedProjectsStatValue_${stat.tone}`] : undefined}>
                  {stat.value}
                  {stat.unit ? <span>{stat.unit}</span> : null}
                </strong>
              </div>
              <div className={`${styles.myProjectsStatIcon} ${styles.sharedProjectsStatIcon}`}>
                <img src={`/assets/shared-projects/icons/${stat.icon}.png?v=2`} alt={stat.iconAlt} width={46} height={46} />
              </div>
            </article>
          ))}
        </div>

        <div className={`${styles.myProjectsMainGrid} ${styles.sharedProjectsMainGrid}`}>
          <div className={styles.myProjectsLeftColumn}>
            <div
              className={`${styles.myProjectsControlsRow} ${styles.sharedProjectsControlsRow} ${isSearchFocused ? styles.sharedProjectsControlsRowSearchActive : ''}`}
              aria-label="프로젝트 목록 필터"
            >
              <div className={`${styles.myProjectsTabs} ${styles.sharedProjectsTabs}`} role="tablist" aria-label="프로젝트 공유 상태 탭">
                {projectTabs.map((tab) => {
                  const isActive = activeTab === tab;

                  return (
                    <button
                      className={`${styles.myProjectsTab} ${styles.sharedProjectsTab} ${isActive ? styles.sharedProjectsTabActive : ''}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        const nextVisibleProjects = tab === '전체' ? projectRows : projectRows.filter((project) => project.tab === tab);
                        setSelectedProjectId(nextVisibleProjects[0]?.id ?? projectRows[0].id);
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <label className={`${styles.myProjectsSearchBox} ${styles.sharedProjectsSearchBox}`}>
                <span className={styles.myProjectsSearchLabel}>검색</span>
                <input
                  type="search"
                  placeholder="프로젝트 검색"
                  aria-label="프로젝트 검색"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="m16.2 16.2 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </label>

              <div className={`${styles.myProjectsFilterGroup} ${styles.sharedProjectsFilterGroup}`} aria-label="프로젝트 필터">
                {projectFilters.map((filter) => (
                  <MyProjectsFilterSelect label={filter.label} options={filter.options} key={filter.label} />
                ))}
              </div>

              <button className={styles.sharedProjectsInviteButton} type="button">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M19 8v6M16 11h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>초대 관리</span>
              </button>
            </div>

            <section className={`${styles.myProjectsTablePanel} ${styles.sharedProjectsTablePanel}`} aria-labelledby="shared-projects-table-title">
            <header className={styles.myProjectsPanelHeader}>
              <h2 id="shared-projects-table-title">공유 프로젝트 목록</h2>
            </header>

            <div className={styles.myProjectsTableWrap}>
              <table className={`${styles.myProjectsTable} ${styles.sharedProjectsTable}`}>
                <colgroup>
                  <col className={styles.sharedProjectsColSelect} />
                  <col className={styles.sharedProjectsColName} />
                  <col className={styles.sharedProjectsColOwner} />
                  <col className={styles.sharedProjectsColRole} />
                  <col className={styles.sharedProjectsColPermission} />
                  <col className={styles.sharedProjectsColReview} />
                  <col className={styles.sharedProjectsColDate} />
                  <col className={styles.sharedProjectsColActivity} />
                  <col className={styles.sharedProjectsColStatus} />
                </colgroup>
                <thead>
                  <tr>
                    <th aria-label="선택" />
                    <th>프로젝트명</th>
                    <th>소유 기관</th>
                    <th>내 역할</th>
                    <th>권한</th>
                    <th>검토 요청</th>
                    <th>공유일</th>
                    <th>최근 활동</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProjects.map((project) => {
                    const isSelected = project.id === selectedProjectId;

                    return (
                      <tr
                        className={isSelected ? styles.myProjectsRowSelected : undefined}
                        aria-selected={isSelected}
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        <td>
                          <button
                            className={`${styles.sharedProjectsSelectButton} ${isSelected ? styles.sharedProjectsSelectButtonActive : ''}`}
                            type="button"
                            aria-label={`${project.name} 선택`}
                            aria-pressed={isSelected}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedProjectId(project.id);
                            }}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden>
                              <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                              {isSelected ? <circle cx="12" cy="12" r="3.8" fill="currentColor" /> : null}
                            </svg>
                          </button>
                        </td>
                        <td>
                          <div className={styles.sharedProjectsNameCell}>
                            <img src={project.thumbnail} alt="" width={42} height={32} />
                            <div>
                              <strong>{project.name}</strong>
                              <span>{project.category}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.sharedProjectsOwner}>{project.owner}</span>
                        </td>
                        <td>
                          <span className={`${styles.sharedProjectsRoleBadge} ${styles[`sharedProjectsRoleBadge_${project.roleTone}`]}`}>
                            {project.role}
                          </span>
                        </td>
                        <td>
                          <span className={styles.sharedProjectsPermission}>
                            <PermissionIcon type={project.permission} />
                            {project.permission}
                          </span>
                        </td>
                        <td className={project.reviewCount > 0 ? styles.myProjectsReviewCount : styles.myProjectsReviewCountZero}>
                          {project.reviewCount}
                        </td>
                        <td>{project.sharedAt}</td>
                        <td>{project.recentActivity}</td>
                        <td>
                          <span className={styles.sharedProjectsStatusDot}>
                            <span aria-hidden />
                            {project.status}
                          </span>
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

            <section className={`${styles.myProjectsRecentPanel} ${styles.sharedProjectsRecentPanel}`} aria-labelledby="shared-projects-recent-title">
            <header className={styles.myProjectsRecentHeader}>
              <h2 id="shared-projects-recent-title">최근 협업 활동</h2>
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

          <aside className={styles.myProjectsRightColumn} aria-label="공유 상세">
            <section className={styles.sharedProjectsDetailPanel}>
              <header className={styles.sharedProjectsDetailHeader}>
                <h2>공유 상세</h2>
              </header>

              <div className={styles.sharedProjectsDetailBody}>
                <div className={styles.sharedProjectsDetailHero}>
                  <img src={selectedProject.thumbnail} alt="" />
                  <div className={styles.sharedProjectsDetailIntro}>
                    <h3>{selectedProject.name}</h3>
                    <span>{selectedProject.category}</span>
                    <dl>
                      <div>
                        <dt>소유 기관</dt>
                        <dd>{selectedProject.owner}</dd>
                      </div>
                      <div>
                        <dt>내 역할</dt>
                        <dd>{selectedProject.role}</dd>
                      </div>
                      <div>
                        <dt>권한</dt>
                        <dd>{selectedProjectDetail.permissionLabel}</dd>
                      </div>
                      <div>
                        <dt>공유 만료일</dt>
                        <dd className={styles.sharedProjectsDetailExpire}>{selectedProjectDetail.expiresAt}</dd>
                      </div>
                      <div>
                        <dt>검토 요청</dt>
                        <dd className={styles.sharedProjectsDetailReview}>{selectedProject.reviewCount}건</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <section className={styles.sharedProjectsMembersPanel} aria-labelledby="shared-projects-members-title">
                  <table className={styles.sharedProjectsMemberTable}>
                    <colgroup>
                      <col className={styles.sharedProjectsMemberColName} />
                      <col className={styles.sharedProjectsMemberColOrg} />
                      <col className={styles.sharedProjectsMemberColRole} />
                      <col className={styles.sharedProjectsMemberColPermission} />
                      <col className={styles.sharedProjectsMemberColPermission} />
                      <col className={styles.sharedProjectsMemberColPermission} />
                      <col className={styles.sharedProjectsMemberColPermission} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col" id="shared-projects-members-title">멤버 (6)</th>
                        <th scope="col">기관</th>
                        <th scope="col">역할</th>
                        <th scope="col">보기</th>
                        <th scope="col">편집</th>
                        <th scope="col">검토</th>
                        <th scope="col">보고서</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedMembers.map((member) => (
                        <tr key={`${member.name}-${member.organization}`}>
                          <td>
                            <div className={styles.sharedProjectsMemberNameCell}>
                              <span className={styles.userInitial}>{member.name.slice(0, 1)}</span>
                              <strong>{member.name}</strong>
                            </div>
                          </td>
                          <td>
                            <em className={styles.sharedProjectsMemberOrg}>{member.organization}</em>
                          </td>
                          <td>
                            <span className={`${styles.sharedProjectsRoleBadge} ${styles[`sharedProjectsRoleBadge_${member.roleTone}`]}`}>
                              {member.role}
                            </span>
                          </td>
                          {[member.view, member.edit, member.review, member.report].map((allowed, index) => (
                            <td key={index}>
                              <b
                                className={allowed ? styles.sharedProjectsPermissionAllowed : styles.sharedProjectsPermissionEmpty}
                                aria-label={allowed ? '허용' : '없음'}
                              >
                                {allowed ? <span aria-hidden /> : '-'}
                              </b>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section className={styles.sharedProjectsInvitesPanel} aria-labelledby="shared-projects-invites-title">
                  <h3 id="shared-projects-invites-title">초대 대기 (2)</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>기관/이메일</th>
                        <th>초대일</th>
                        <th>만료일</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingInvites.map((invite) => (
                        <tr key={invite.contact}>
                          <td>{invite.contact}</td>
                          <td>{invite.invitedAt}</td>
                          <td>{invite.expiresAt}</td>
                          <td>{invite.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <div className={styles.sharedProjectsDetailActions}>
                  <button type="button" onClick={() => router.push('/digital-twin/3d')}>
                    프로젝트 열기
                  </button>
                  <button type="button">
                    권한 요청
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
