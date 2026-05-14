'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../page.module.css';

const navGroups = [
  {
    label: '관리자',
    items: [
      { icon: 'dashboard', label: '대시보드' },
      {
        icon: 'users',
        label: '사용자 관리',
        children: ['전체 사용자', '초대 요청', '접속 이력']
      },
      { icon: 'roles', label: '역할 권한' },
      { icon: 'key', label: 'API 키 관리' },
      { icon: 'model', label: '모델 배포' },
      {
        icon: 'report',
        label: '보고서',
        children: ['보고서 생성', '보고서 목록', '템플릿 관리']
      },
      { icon: 'settings', label: '시스템 설정', active: true }
    ]
  },
  {
    label: '플랫폼 관리',
    items: [
      { icon: 'infra', label: '인프라 상태' },
      { icon: 'data', label: '데이터 관리' },
      { icon: 'security', label: '보안 관리' },
      { icon: 'backup', label: '백업 관리' },
      { icon: 'audit', label: '감사 로그' },
      { icon: 'alert', label: '알림 설정' }
    ]
  },
  {
    label: '지원',
    items: [
      { icon: 'license', label: '라이선스' },
      { icon: 'support', label: '문의 관리' }
    ]
  }
];

const tabs = ['사용자 관리', '역할 권한', 'API 키', '모델 배포', '인프라 상태', '시스템 설정'];

const users = [
  {
    initial: '김',
    name: '김미리',
    email: 'miri.kim@doi.co.kr',
    role: '최고 관리자',
    roleTone: 'super',
    team: '경영지원팀',
    status: '활성',
    statusTone: 'active',
    lastSeen: '2025-05-23 10:24'
  },
  {
    initial: '이',
    name: '이준호',
    email: 'junho.lee@doi.co.kr',
    role: '관리자',
    roleTone: 'admin',
    team: '기술연구소',
    status: '활성',
    statusTone: 'active',
    lastSeen: '2025-05-23 09:41'
  },
  {
    initial: '박',
    name: '박서연',
    email: 'seoyeon.park@doi.co.kr',
    role: '매니저',
    roleTone: 'manager',
    team: '사업개발팀',
    status: '활성',
    statusTone: 'active',
    lastSeen: '2025-05-23 08:17'
  },
  {
    initial: '최',
    name: '최현우',
    email: 'hyunwoo.choi@doi.co.kr',
    role: '분석가',
    roleTone: 'analyst',
    team: 'GeoAI팀',
    status: '활성',
    statusTone: 'active',
    lastSeen: '2025-05-22 18:33'
  },
  {
    initial: '정',
    name: '정다운',
    email: 'daeun.jung@doi.co.kr',
    role: '조회자',
    roleTone: 'viewer',
    team: '공공사업팀',
    status: '비활성',
    statusTone: 'inactive',
    lastSeen: '2025-05-15 14:22'
  }
];

function HeaderIcon({
  type,
  label,
  onClick,
  pressed
}: {
  type: 'bell' | 'help' | 'fullscreen' | 'gear' | 'chevron';
  label: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  if (type === 'bell') {
    return (
      <button className={styles.headerIconButton} aria-label={label} type="button">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
        <span className={styles.badge}>12</span>
      </button>
    );
  }
  if (type === 'help') {
    return (
      <button className={styles.headerIconButton} aria-label={label} type="button">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>
    );
  }
  if (type === 'gear') {
    return (
      <button className={styles.headerIconButton} aria-label={label} type="button">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    );
  }
  if (type === 'fullscreen') {
    return (
      <button className={styles.headerIconButton} aria-label={label} aria-pressed={pressed} type="button" onClick={onClick}>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {pressed ? (
            <>
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M16 3v3a2 2 0 0 0 2 2h3" />
              <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            </>
          ) : (
            <>
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
              <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
            </>
          )}
        </svg>
      </button>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-label={label}>
      <path d="m7 9 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminSidebar() {
  const [openNav, setOpenNav] = useState<Record<string, boolean>>({});

  const toggleNav = (label: string) => {
    setOpenNav((current) => ({
      ...current,
      [label]: !current[label]
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <Link className={styles.logoBox} href="/landing" aria-label="Terranium landing page">
        <img className={styles.logoImage} src="/assets/admin/logo-terranium6-white-text-clean.png?v=1" alt="Terranium" width={160} height={45} />
      </Link>

      <nav className={styles.nav}>
        {navGroups.map((group, groupIndex) => (
          <section className={styles.navGroup} key={group.label}>
            <div className={styles.groupTitle}>{group.label}</div>
            {group.items.map((item) => {
              const isOpen = Boolean(openNav[item.label]);
              const hasChildren = 'children' in item && Boolean(item.children?.length);

              return (
                <div className={styles.navEntry} key={item.label}>
                  <button
                    className={`${styles.navItem} ${item.active ? styles.activeNav : ''}`}
                    type="button"
                    aria-expanded={hasChildren ? isOpen : undefined}
                    onClick={hasChildren ? () => toggleNav(item.label) : undefined}
                  >
                    <span className={styles.activeRail} aria-hidden />
                    <img
                      src={`/assets/admin/icons/${item.icon}-${item.active ? 'yellow' : 'white'}.png?v=7`}
                      alt=""
                      width={23}
                      height={23}
                      className={styles.navIcon}
                    />
                    <span className={styles.navLabel}>{item.label}</span>
                    {hasChildren ? (
                      <svg
                        className={`${styles.navChevron} ${isOpen ? styles.navChevronOpen : ''}`}
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden
                      >
                        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                  {hasChildren && isOpen ? (
                    <div className={styles.subNav}>
                      {item.children?.map((child) => (
                        <button className={styles.subNavItem} type="button" key={child}>
                          {child}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {groupIndex < navGroups.length - 1 ? <div className={styles.divider} /> : null}
          </section>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div>Version 1.0.0</div>
        <div>© 2026 DOI Inc.</div>
      </div>
    </aside>
  );
}

export function AdminTopbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void document.documentElement.requestFullscreen();
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.titleBlock}>
        <h1>시스템 설정</h1>
        <span>Admin Console</span>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.headerIconGroup}>
          <HeaderIcon type="bell" label="알림" />
          <HeaderIcon type="help" label="도움말" />
          <HeaderIcon type="fullscreen" label="전체화면" pressed={isFullscreen} onClick={toggleFullscreen} />
          <HeaderIcon type="gear" label="설정" />
        </div>
        <div className={styles.userBlock}>
          <div className={styles.avatar}>DA</div>
          <div className={styles.userText}>
            <strong>DOI Admin</strong>
            <span>Super Administrator</span>
          </div>
          <svg className={styles.userChevron} viewBox="0 0 24 24" width="18" height="18" aria-label="펼치기">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export function AdminChrome({ children }: { children: ReactNode }) {
  return (
    <main className={styles.stage}>
      <AdminSidebar />

      <section className={styles.shell}>
        <AdminTopbar />
        {children}
      </section>
    </main>
  );
}

export function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className={styles.workspace} aria-label={`${activeTab} admin workspace`}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            className={`${styles.tab} ${tab === activeTab ? styles.activeTab : ''}`}
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <AdminWorkspaceContent activeTab={activeTab} />
    </section>
  );
}

function AdminWorkspaceContent({ activeTab }: { activeTab: string }) {
  return (
    <div className={styles.contentLayout} aria-label={`${activeTab} dashboard layout`}>
      <div className={styles.contentGrid}>
        <section className={`${styles.panel} ${styles.userPanel}`}>
          <div className={styles.userPanelHeader}>
            <div className={styles.panelTitleGroup}>
              <h2>사용자 관리</h2>
              <span>전체 48명</span>
            </div>
            <div className={styles.userToolbar}>
              <button type="button" className={styles.userActionButton}>
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
                  <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                사용자 추가
              </button>
              <button type="button" className={styles.userActionButton}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                  <path d="M12 3v10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="m8 9 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                CSV 내보내기
              </button>
              <button type="button" className={styles.refreshButton} aria-label="새로고침">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 4v6h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>소속</th>
                <th>상태</th>
                <th>최근 접속</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>
                    <div className={styles.userNameCell}>
                      <span className={styles.userInitial}>{user.initial}</span>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[`roleBadge_${user.roleTone}`]}`}>{user.role}</span>
                  </td>
                  <td>{user.team}</td>
                  <td>
                    <span className={`${styles.statusCheck} ${styles[`statusCheck_${user.statusTone}`]}`} aria-label={user.status} role="img">
                      {user.statusTone === 'active' ? (
                        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                          <path d="m6.5 12.2 3.4 3.5 7.6-8" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                          <path d="M7.5 7.5 16.5 16.5M16.5 7.5 7.5 16.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td>{user.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.userPanelFooter}>
            <div className={styles.pagination}>
              <button type="button" aria-label="이전 페이지">
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                  <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className={styles.currentPage}>1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">4</button>
              <button type="button">5</button>
              <button type="button" aria-label="다음 페이지">
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                  <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button type="button" className={styles.pageSizeButton}>
              10 / 페이지
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>
        <section className={`${styles.panel} ${styles.apiPanel}`} />
        <section className={`${styles.panel} ${styles.sovereigntyPanel}`} />
        <section className={`${styles.panel} ${styles.infraPanel}`} />
        <section className={`${styles.panel} ${styles.deployPanel}`} />
        <section className={`${styles.panel} ${styles.accessPanel}`} />
        <section className={`${styles.panel} ${styles.auditPanel}`} />
        <section className={`${styles.panel} ${styles.licensePanel}`} />
      </div>
    </div>
  );
}
