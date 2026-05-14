'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import styles from '../page.module.css';

type NavGroup = {
  label: string;
  items: Array<{
    icon: string;
    label: string;
    href?: string;
    children?: Array<string | { label: string; href?: string }>;
  }>;
};

const adminNavGroups: NavGroup[] = [
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
      { icon: 'settings', label: '시스템 설정' }
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

const userNavGroups: NavGroup[] = [
  {
    label: '워크스페이스',
    items: [
      { icon: 'dashboard', label: '대시보드', href: '/' },
      {
        icon: 'infra',
        label: '디지털 트윈',
        children: [{ label: '3D 디지털 트윈', href: '/digital-twin/3d' }, { label: '2D 지도', href: '/digital-twin/2d' }]
      },
      {
        icon: 'model',
        label: '분석',
        children: [{ label: 'GeoAI 분석', href: '/analytics/geoai' }, { label: 'AI 분석 결과', href: '/analytics/results' }]
      },
      {
        icon: 'report',
        label: '보고서',
        children: [{ label: '보고서 생성', href: '/reports/create' }, { label: '보고서 목록', href: '/reports' }, { label: '템플릿 관리', href: '/reports/templates' }]
      }
    ]
  },
  {
    label: '작업 관리',
    items: [
      {
        icon: 'data',
        label: '프로젝트',
        children: [{ label: '전체 프로젝트', href: '/projects' }, { label: '최근 작업', href: '/projects/recent' }, { label: '공유된 프로젝트', href: '/projects/shared' }]
      },
      { icon: 'users', label: '협업 관리', href: '/collaboration' },
      { icon: 'roles', label: '권한 관리', href: '/permissions' },
      { icon: 'security', label: '검수 승인', href: '/review-approval' },
      { icon: 'backup', label: '데이터 보관', href: '/data-archive' },
      { icon: 'settings', label: '시스템 설정', href: '/settings' }
    ]
  },
  {
    label: '지원',
    items: [
      { icon: 'license', label: '라이선스', href: '/license' },
      { icon: 'support', label: '문의하기', href: '/support' },
      { icon: 'infra', label: '모니터링', href: '/monitoring' }
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

const projectOptions = [
  '울산 미포 국가산단',
  '평택 스마트 안전산단',
  '부산항 항만시설',
  '새만금 산업단지'
];

const captureDateOptions = ['2024-05-06', '2024-03-15', '2024-02-10', '2024-07-18', '2024-08-24'];

function ViewerSelect({
  label,
  value,
  options,
  variant,
  icon
}: {
  label: string;
  value: string;
  options: string[];
  variant: 'project' | 'date';
  icon?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();

  return (
    <div className={`${styles.viewerSelectWrap} ${variant === 'project' ? styles.projectSelectWrap : styles.dateSelectWrap}`}>
      <button
        type="button"
        className={`${styles.viewerSelect} ${variant === 'project' ? styles.projectSelect : styles.dateSelect}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
      >
        <span>{label}</span>
        <em>{value}</em>
        {icon ?? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path d="m7 9 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div className={styles.viewerSelectMenu} id={listboxId} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              type="button"
              className={`${styles.viewerSelectOption} ${option === value ? styles.viewerSelectOptionActive : ''}`}
              role="option"
              aria-selected={option === value}
              key={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setIsOpen(false)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ViewerToolIcon({ type }: { type: 'measure' | 'compare' | 'share' | 'export' | 'help' | 'menu' | 'calendar' }) {
  if (type === 'measure') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="m15.5 4.5 4 4L8 20H4v-4L15.5 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m13.5 6.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m8 16 2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'compare') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M7 4v16M17 4v16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m10 7-3-3-3 3M14 17l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 8h3.5A2.5 2.5 0 0 1 17 10.5V20M13 16H9.5A2.5 2.5 0 0 1 7 13.5V4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'share') {
    return (
      <svg className={styles.viewerIconShare} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'export') {
    return (
      <svg className={styles.viewerIconExport} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M12 4v10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" />
        <path d="m7.8 10.6 4.2 4.2 4.2-4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" strokeLinejoin="miter" />
        <path d="M5.2 16.4v3.1h13.6v-3.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" strokeLinejoin="miter" />
      </svg>
    );
  }
  if (type === 'help') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9.6 9a2.7 2.7 0 0 1 5.1 1.3c0 1.8-2.7 2.4-2.7 3.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
        <path d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="butt" />
    </svg>
  );
}

export function ViewerTopbar3D() {
  return (
    <header className={styles.viewerTopbar}>
      <div className={styles.viewerSelectors}>
        <ViewerSelect label="프로젝트" value="울산 미포 국가산단" options={projectOptions} variant="project" />
        <ViewerSelect label="촬영일" value="2024-05-06" options={captureDateOptions} variant="date" icon={<ViewerToolIcon type="calendar" />} />
      </div>

      <div className={styles.viewerActions}>
        <button type="button" className={styles.viewerActionButton}>
          <ViewerToolIcon type="measure" />
          <span>측정 도구</span>
        </button>
        <button type="button" className={styles.viewerActionButton}>
          <ViewerToolIcon type="compare" />
          <span>변화 비교</span>
        </button>
        <button type="button" className={styles.viewerActionButton}>
          <ViewerToolIcon type="share" />
          <span>공유</span>
        </button>
        <button type="button" className={styles.viewerActionButton}>
          <ViewerToolIcon type="export" />
          <span>내보내기</span>
        </button>
        <button type="button" className={styles.viewerActionButton}>
          <ViewerToolIcon type="help" />
          <span>도움말</span>
        </button>
        <button type="button" className={styles.viewerMenuButton} aria-label="메뉴">
          <ViewerToolIcon type="menu" />
        </button>
      </div>
    </header>
  );
}

export function AdminSidebar({
  activeItemLabel = '시스템 설정',
  variant = 'admin',
  footerVariant = 'default'
}: {
  activeItemLabel?: string;
  variant?: 'admin' | 'user';
  footerVariant?: 'default' | 'projectProfile';
}) {
  const [openNav, setOpenNav] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const navGroups = variant === 'user' ? userNavGroups : adminNavGroups;

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
              const isActive = item.label === activeItemLabel;
              const hasChildren = 'children' in item && Boolean(item.children?.length);
              const isOpen = hasChildren && (isActive || Boolean(openNav[item.label]));

              return (
                <div className={styles.navEntry} key={item.label}>
                  {item.href && !hasChildren ? (
                    <Link className={`${styles.navItem} ${isActive ? styles.activeNav : ''}`} href={item.href}>
                      <span className={styles.activeRail} aria-hidden />
                      <img
                        src={`/assets/admin/icons/${item.icon}-${isActive ? 'yellow' : 'white'}.png?v=7`}
                        alt=""
                        width={23}
                        height={23}
                        className={styles.navIcon}
                      />
                      <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={`${styles.navItem} ${isActive ? styles.activeNav : ''}`}
                      type="button"
                      aria-expanded={hasChildren ? isOpen : undefined}
                      onClick={hasChildren && !isActive ? () => toggleNav(item.label) : undefined}
                    >
                      <span className={styles.activeRail} aria-hidden />
                      <img
                        src={`/assets/admin/icons/${item.icon}-${isActive ? 'yellow' : 'white'}.png?v=7`}
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
                  )}
                  {hasChildren && isOpen ? (
                    <div className={styles.subNav}>
                      {item.children?.map((child) => {
                        const childLabel = typeof child === 'string' ? child : child.label;
                        const childHref = typeof child === 'string' ? undefined : child.href;
                        const isChildActive = Boolean(childHref && pathname === childHref);

                        if (childHref) {
                          return (
                            <Link
                              className={`${styles.subNavItem} ${isChildActive ? styles.subNavItemActive : ''}`}
                              href={childHref}
                              key={childLabel}
                              aria-current={isChildActive ? 'page' : undefined}
                            >
                              {childLabel}
                            </Link>
                          );
                        }

                        return (
                          <button className={styles.subNavItem} type="button" key={childLabel}>
                            {childLabel}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {groupIndex < navGroups.length - 1 ? <div className={styles.divider} /> : null}
          </section>
        ))}
      </nav>

      {footerVariant === 'projectProfile' ? <ProjectProfileSidebarFooter /> : <DefaultSidebarFooter />}
    </aside>
  );
}

function DefaultSidebarFooter() {
  return (
    <div className={styles.sidebarFooter}>
      <div>Version 1.0.0</div>
      <div>© 2026 DOI Inc.</div>
    </div>
  );
}

function ProjectProfileSidebarFooter() {
  return (
    <div className={styles.projectSidebarFooter}>
      <section className={styles.projectInfoCard} aria-label="현재 프로젝트 정보">
        <h2>울산 미포 국가산단</h2>
        <dl>
          <div>
            <dt>프로젝트 ID</dt>
            <dd>ULSAN-MIPO-2024</dd>
          </div>
          <div>
            <dt>생성일</dt>
            <dd>2024-05-08</dd>
          </div>
        </dl>
        <button type="button" className={styles.projectManageButton}>
          <span>프로젝트 관리</span>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
            <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      <section className={styles.sidebarProfile} aria-label="사용자 프로필">
        <div className={styles.sidebarProfileAvatar} aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M20 21a8 8 0 0 0-16 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>
        <div className={styles.sidebarProfileText}>
          <strong>DOI Admin</strong>
          <span>Administrator</span>
        </div>
        <svg className={styles.sidebarProfileChevron} viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </section>
    </div>
  );
}

export function AdminTopbar({
  title = '시스템 설정',
  subtitle = 'Admin Console'
}: {
  title?: string;
  subtitle?: string;
}) {
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
        <h1>{title}</h1>
        {subtitle ? <span>{subtitle}</span> : null}
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

export function AdminChrome({
  children,
  activeItemLabel,
  sidebarVariant = 'admin',
  sidebarFooterVariant = 'default',
  topbarVariant = 'default',
  title = '시스템 설정',
  subtitle = 'Admin Console'
}: {
  children: ReactNode;
  activeItemLabel?: string;
  sidebarVariant?: 'admin' | 'user';
  sidebarFooterVariant?: 'default' | 'projectProfile';
  topbarVariant?: 'default' | 'viewer3d';
  title?: string;
  subtitle?: string;
}) {
  return (
    <main className={styles.stage}>
      <AdminSidebar activeItemLabel={activeItemLabel} variant={sidebarVariant} footerVariant={sidebarFooterVariant} />

      <section className={styles.shell}>
        {topbarVariant === 'viewer3d' ? <ViewerTopbar3D /> : <AdminTopbar title={title} subtitle={subtitle} />}
        {children}
      </section>
    </main>
  );
}

type ChromeProps = {
  sidebarVariant: 'admin' | 'user';
  sidebarFooterVariant?: 'default' | 'projectProfile';
  activeItemLabel?: string;
  topbarVariant: 'default' | 'viewer3d';
  title: string;
  subtitle: string;
};

const userPathnameMap: Map<string, { parent: string; child: string }> = (() => {
  const map = new Map<string, { parent: string; child: string }>();
  for (const group of userNavGroups) {
    for (const item of group.items) {
      const hasChildren = Boolean(item.children?.length);
      if (!hasChildren && item.href) {
        map.set(item.href, { parent: item.label, child: item.label });
        continue;
      }
      for (const child of item.children ?? []) {
        if (typeof child === 'string' || !child.href) continue;
        map.set(child.href, { parent: item.label, child: child.label });
      }
    }
  }
  return map;
})();

export function getWorkspaceChromeProps(pathname: string): ChromeProps {
  if (pathname.startsWith('/admin')) {
    return {
      sidebarVariant: 'admin',
      sidebarFooterVariant: 'default',
      activeItemLabel: '시스템 설정',
      topbarVariant: 'default',
      title: '시스템 설정',
      subtitle: 'Admin Console'
    };
  }

  const meta = userPathnameMap.get(pathname);
  const topbarVariant: ChromeProps['topbarVariant'] = pathname.startsWith('/digital-twin/3d') ? 'viewer3d' : 'default';
  const sidebarFooterVariant: ChromeProps['sidebarFooterVariant'] = pathname.startsWith('/digital-twin/3d') ? 'projectProfile' : 'default';

  return {
    sidebarVariant: 'user',
    sidebarFooterVariant,
    activeItemLabel: meta?.parent,
    topbarVariant,
    title: meta?.child ?? '',
    subtitle: ''
  };
}

export function EmptyWorkspace({ label = '작업 화면' }: { label?: string }) {
  return (
    <section className={styles.workspace} aria-label={label}>
      <div className={styles.contentLayout}>
        <div className={styles.emptyDashboardCanvas} />
      </div>
    </section>
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
