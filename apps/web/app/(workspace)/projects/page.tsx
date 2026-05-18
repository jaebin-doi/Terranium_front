'use client';

import { useState } from 'react';

import styles from '../../page.module.css';

const projectCreateSteps = [
  '기본 정보',
  '위치/좌표',
  '데이터 구성',
  '팀/권한',
  '검토 및 생성'
];

const projectCreateDatasetCards = [
  { key: 'ortho', title: '정사영상', sub: 'Orthomosaic', icon: '/assets/project-create/dataset/orthomosaic.png' },
  { key: 'pcd', title: 'Point Cloud', sub: 'LiDAR', icon: '/assets/project-create/dataset/point-cloud.png' },
  { key: 'mesh', title: '3D Mesh', sub: 'Textured', icon: '/assets/project-create/dataset/3d-mesh.png' },
  { key: 'dsm', title: 'DSM / DEM', sub: '지형모델', icon: '/assets/project-create/dataset/dsm-dem.png' },
  { key: 'geoai', title: 'GeoAI 결과', sub: '탐지/분석', icon: '/assets/project-create/dataset/geoai.png' },
  { key: 'report', title: '보고서 템플릿', sub: '기본', icon: '/assets/project-create/dataset/report.png' }
] as const;

const projectCreateDatasetDefaults: Record<string, boolean> = {
  ortho: false,
  pcd: false,
  mesh: false,
  dsm: false,
  geoai: false,
  report: false
};

const projectCreateWorkflowStages = [
  { key: 'pending', code: 'PENDING', label: '대기', tone: 'pending' },
  { key: 'accepted', code: 'ACCEPTED', label: '승인', tone: 'accepted' },
  { key: 'rejected', code: 'REJECTED', label: '반려', tone: 'rejected' },
  { key: 'review', code: 'NEEDS_REVIEW', label: '재검토', tone: 'review' }
] as const;

const projectCreateTeamMembers = [
  { key: 'admin', name: 'DOI Admin (나)', email: 'admin@doicorp.com', role: '소유자', initials: 'DA', tone: 'owner' },
  { key: 'park', name: '박서연', email: 'seoyeon.park@doicorp.com', role: '관리자', initials: '박', tone: 'manager' },
  { key: 'lee', name: '이준호', email: 'junho.lee@doicorp.com', role: '분석가', initials: '이', tone: 'analyst' }
] as const;

const projectCreateProcessingPlan = [
  '데이터 업로드',
  '전처리 / 정합',
  '3D 생성 (Mesh/Point Cloud)',
  'GeoAI 분석',
  '검토 및 보고서'
] as const;

const projectCreateThresholdMin = 0.1;
const projectCreateThresholdMax = 0.95;
const projectCreateThresholdStep = 0.01;

const clampProjectCreateThreshold = (value: number) =>
  Math.min(projectCreateThresholdMax, Math.max(projectCreateThresholdMin, value));

const formatProjectCreateThreshold = (value: number) => clampProjectCreateThreshold(value).toFixed(2);

export default function ProjectsPage() {
  const [datasetSelection, setDatasetSelection] = useState<Record<string, boolean>>(projectCreateDatasetDefaults);
  const [thresholdValue, setThresholdValue] = useState(0.6);
  const thresholdPercent =
    ((thresholdValue - projectCreateThresholdMin) / (projectCreateThresholdMax - projectCreateThresholdMin)) * 100;

  const toggleDataset = (key: string) => {
    setDatasetSelection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateThresholdValue = (value: number) => {
    setThresholdValue(Number(formatProjectCreateThreshold(value)));
  };

  const adjustThresholdValue = (delta: number) => {
    setThresholdValue((prev) => Number(formatProjectCreateThreshold(prev + delta)));
  };

  return (
    <section className={styles.workspace} aria-label="프로젝트 생성">
      <div className={styles.projectCreateWorkspace}>
        <ol className={styles.projectCreateStepper} aria-label="프로젝트 생성 단계">
          {projectCreateSteps.map((step, index) => {
            const isActive = index === 0;

            return (
              <li
                className={`${styles.projectCreateStep} ${isActive ? styles.projectCreateStepActive : ''}`}
                key={step}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.projectCreateStepBody}>
                  <span className={styles.projectCreateStepNumber}>{index + 1}</span>
                  <span className={styles.projectCreateStepLabel}>{step}</span>
                </span>
                {index < projectCreateSteps.length - 1 ? <span className={styles.projectCreateStepLine} aria-hidden /> : null}
              </li>
            );
          })}
        </ol>

        <div className={styles.projectCreateBody}>
          <div className={styles.projectCreateLeftColumn}>
            <section className={styles.projectCreateBasicPanel} aria-labelledby="project-basic-info-title">
              <header className={styles.projectCreatePanelHeader}>
                <h2 id="project-basic-info-title">기본 정보</h2>
              </header>

              <div className={styles.projectCreateBasicFields}>
                <label className={styles.projectCreateField}>
                  <span>
                    프로젝트명 <em>*</em>
                  </span>
                  <input type="text" defaultValue="울산 미포 국가산단 안전점검" />
                </label>

                <label className={styles.projectCreateField}>
                  <span>
                    현장명 <em>*</em>
                  </span>
                  <input type="text" defaultValue="미포 국가산업단지" />
                </label>

                <label className={styles.projectCreateField}>
                  <span>
                    현장 유형 <em>*</em>
                  </span>
                  <select defaultValue="industrial">
                    <option value="industrial">산업시설</option>
                  </select>
                </label>

                <label className={styles.projectCreateField}>
                  <span>
                    프로젝트 상태 <em>*</em>
                  </span>
                  <span
                    className={styles.projectCreateStatusSelect}
                    role="combobox"
                    tabIndex={0}
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-label="프로젝트 상태"
                  >
                    <span className={styles.projectCreateStatusDot} aria-hidden />
                    <strong>활성</strong>
                  </span>
                </label>

                <label className={`${styles.projectCreateField} ${styles.projectCreateDescriptionField}`}>
                  <span>설명</span>
                  <span className={styles.projectCreateTextareaWrap}>
                    <textarea defaultValue="울산 미포 국가산업단지 일대의 드론 촬영 데이터 기반 안전점검 및 시설물 이상 탐지 프로젝트입니다." />
                    <small>52 / 500</small>
                  </span>
                </label>
              </div>
            </section>

            <section className={styles.projectCreateLocationPanel} aria-labelledby="project-location-title">
              <header className={styles.projectCreatePanelHeader}>
                <h2 id="project-location-title">위치 및 좌표계</h2>
              </header>

              <div className={styles.projectCreateLocationBody}>
                <div className={styles.projectCreateLocationForm}>
                  <label className={`${styles.projectCreateField} ${styles.projectCreateLocationFieldFull}`}>
                    <span>주소</span>
                    <span className={styles.projectCreateAddressRow}>
                      <input type="text" defaultValue="울산광역시 동구 미포동 100-1 일대" />
                      <button type="button" className={styles.projectCreateMapPicker}>
                        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden>
                          <path
                            d="M12 3.4c-3.7 0-6.8 3-6.8 6.7 0 4.9 6.8 10.5 6.8 10.5s6.8-5.6 6.8-10.5c0-3.7-3.1-6.7-6.8-6.7Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                        지도에서 선택
                      </button>
                    </span>
                  </label>

                  <label className={styles.projectCreateField}>
                    <span>
                      좌표계 (EPSG) <em>*</em>
                    </span>
                    <select defaultValue="epsg5179">
                      <option value="epsg5179">EPSG:5179 (Korea 2000 / Unified CS)</option>
                    </select>
                  </label>

                  <label className={styles.projectCreateField}>
                    <span>중심 좌표 (X, Y)</span>
                    <span className={styles.projectCreateCenterCoords}>
                      <span className={styles.projectCreateCoordInput}>
                        <span aria-hidden>X</span>
                        <input type="text" defaultValue="254,367.489" />
                      </span>
                      <span className={styles.projectCreateCoordInput}>
                        <span aria-hidden>Y</span>
                        <input type="text" defaultValue="196,532.735" />
                      </span>
                      <button type="button" className={styles.projectCreateCoordCopy} aria-label="좌표 복사">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                          <rect x="8" y="8" width="11" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M5 16V5.5A1.5 1.5 0 0 1 6.5 4H15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  </label>

                  <label className={`${styles.projectCreateField} ${styles.projectCreateLocationFieldFull}`}>
                    <span>행정구역</span>
                    <select defaultValue="dong-gu">
                      <option value="dong-gu">울산광역시 동구</option>
                    </select>
                  </label>
                </div>

                <div className={styles.projectCreateMapPreview}>
                  <div className={styles.projectCreateMapCanvas} aria-hidden>
                    <img src="/assets/viewer/industrial-digital-twin-scene.png" alt="" />
                    <div className={styles.projectCreateMapControls}>
                      <button type="button" className={styles.projectCreateMapControl} aria-label="확대">
                        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden>
                          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button type="button" className={styles.projectCreateMapControl} aria-label="축소">
                        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden>
                          <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button type="button" className={styles.projectCreateMapControl} aria-label="중심 위치">
                        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden>
                          <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.projectCreateMapFooter}>
                    <span className={styles.projectCreateMapArea}>면적 82,652.16 ㎡</span>
                    <button type="button" className={styles.projectCreateMapEdit}>다각형 편집</button>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.projectCreateDatasetPanel} aria-labelledby="project-dataset-title">
              <header className={styles.projectCreatePanelHeader}>
                <h2 id="project-dataset-title">초기 데이터 구성</h2>
              </header>

              <div className={styles.projectCreateDatasetGrid}>
                {projectCreateDatasetCards.map((card) => {
                  const isActive = !!datasetSelection[card.key];
                  return (
                    <button
                      key={card.key}
                      type="button"
                      className={`${styles.projectCreateDatasetCard} ${isActive ? styles.projectCreateDatasetCardActive : ''}`}
                      aria-pressed={isActive}
                      onClick={() => toggleDataset(card.key)}
                    >
                      <span className={styles.projectCreateDatasetIcon}>
                        <img src={card.icon} alt="" />
                      </span>
                      <span className={styles.projectCreateDatasetText}>
                        <span className={styles.projectCreateDatasetTitle}>{card.title}</span>
                        <span className={styles.projectCreateDatasetSub}>({card.sub})</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.projectCreateGeoaiPanel} aria-labelledby="project-geoai-title">
              <header className={styles.projectCreatePanelHeader}>
                <h2 id="project-geoai-title">GeoAI 모델</h2>
              </header>

              <div className={styles.projectCreateGeoaiBody}>
                <div className={styles.projectCreateGeoaiCol}>
                  <label className={styles.projectCreateField}>
                    <span>
                      모델 선택 <em>*</em>
                    </span>
                    <select defaultValue="road-v23">
                      <option value="road-v23">Road Damage Detection v2.3</option>
                    </select>
                  </label>
                  <p className={styles.projectCreateGeoaiHint}>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 11v5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="12" cy="7.8" r="1" fill="currentColor" />
                    </svg>
                    도로 파손, 균열, 포트홀 등 이상 탐지에 최적화된 모델
                  </p>
                </div>

                <div className={styles.projectCreateGeoaiCol}>
                  <div className={styles.projectCreateField}>
                    <span>신뢰도 임계값</span>
                    <div className={styles.projectCreateThresholdStack}>
                      <div className={styles.projectCreateThresholdNumberWrap}>
                        <input
                          type="number"
                          className={styles.projectCreateThresholdNumber}
                          value={formatProjectCreateThreshold(thresholdValue)}
                          step={projectCreateThresholdStep}
                          min={projectCreateThresholdMin}
                          max={projectCreateThresholdMax}
                          onChange={(event) => {
                            const nextValue = Number(event.target.value);

                            if (!Number.isNaN(nextValue)) {
                              updateThresholdValue(nextValue);
                            }
                          }}
                        />
                        <div className={styles.projectCreateThresholdSpinner}>
                          <button
                            type="button"
                            className={styles.projectCreateThresholdSpinnerButton}
                            aria-label="신뢰도 임계값 증가"
                            onClick={() => adjustThresholdValue(projectCreateThresholdStep)}
                          >
                            <span className={styles.projectCreateThresholdSpinnerUp} />
                          </button>
                          <button
                            type="button"
                            className={styles.projectCreateThresholdSpinnerButton}
                            aria-label="신뢰도 임계값 감소"
                            onClick={() => adjustThresholdValue(-projectCreateThresholdStep)}
                          >
                            <span className={styles.projectCreateThresholdSpinnerDown} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.projectCreateThresholdScale}>
                        <span className={styles.projectCreateThresholdBound}>0.10</span>
                        <input
                          type="range"
                          className={styles.projectCreateThresholdSlider}
                          min={projectCreateThresholdMin}
                          max={projectCreateThresholdMax}
                          step={projectCreateThresholdStep}
                          value={formatProjectCreateThreshold(thresholdValue)}
                          onChange={(event) => updateThresholdValue(Number(event.target.value))}
                          aria-label="신뢰도 임계값 슬라이더"
                          style={{
                            background: `linear-gradient(90deg, #ffc107 0%, #ffc107 ${thresholdPercent}%, #d3dbe3 ${thresholdPercent}%, #d3dbe3 100%)`
                          }}
                        />
                        <span className={styles.projectCreateThresholdBound}>0.95</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCreateGeoaiCol}>
                  <div className={styles.projectCreateField}>
                    <span>검토 워크플로우</span>
                    <div className={styles.projectCreateWorkflowGrid}>
                      <div className={styles.projectCreateWorkflowBadges}>
                        {projectCreateWorkflowStages.map((stage) => (
                          <div key={stage.key} className={styles.projectCreateWorkflowItem}>
                            <span
                              className={`${styles.projectCreateWorkflowPill} ${styles[`projectCreateWorkflowPill_${stage.tone}`]}`}
                            >
                              {stage.code}
                            </span>
                            <span className={styles.projectCreateWorkflowLabel}>{stage.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className={styles.projectCreatePreviewPanel} aria-labelledby="project-preview-title">
            <header className={styles.projectCreatePreviewHeader}>
              <h2 id="project-preview-title">프로젝트 미리보기</h2>
            </header>

            <div className={styles.projectCreatePreviewBody}>
              <div className={styles.projectCreatePreviewMap}>
                <img src="/assets/viewer/industrial-digital-twin-scene.png" alt="산업단지 프로젝트 미리보기 지도" />
                <button
                  type="button"
                  className={`${styles.projectCreateMapControl} ${styles.projectCreatePreviewExpand}`}
                  aria-label="확대"
                >
                  <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
                    <path
                      d="M8.2 4.8H4.8v3.4M15.8 4.8h3.4v3.4M19.2 15.8v3.4h-3.4M8.2 19.2H4.8v-3.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.8 4.8 9 9M19.2 4.8 15 9M19.2 19.2 15 15M4.8 19.2 9 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.projectCreatePreviewStats} aria-label="프로젝트 예상 지표">
                <div className={styles.projectCreatePreviewStat}>
                  <span>예상 데이터셋</span>
                  <strong>5 <em>개</em></strong>
                </div>
                <div className={styles.projectCreatePreviewStat}>
                  <span>예상 저장 용량</span>
                  <strong>128.4 <em>GB</em></strong>
                </div>
                <div className={styles.projectCreatePreviewStat}>
                  <span>예상 검토 항목</span>
                  <strong>2,340 <em>건</em></strong>
                </div>
              </div>

              <section className={styles.projectCreatePreviewSection} aria-labelledby="project-preview-team-title">
                <div className={styles.projectCreatePreviewSectionHeader}>
                  <h3 id="project-preview-team-title">팀 구성 (3)</h3>
                  <button type="button">편집</button>
                </div>

                <div className={styles.projectCreateTeamList}>
                  {projectCreateTeamMembers.map((member) => (
                    <div className={styles.projectCreateTeamItem} key={member.key}>
                      <span className={styles.projectCreateTeamAvatar} aria-hidden="true">
                        {member.initials}
                      </span>
                      <span className={styles.projectCreateTeamText}>
                        <span className={styles.projectCreateTeamName}>{member.name}</span>
                        <span className={styles.projectCreateTeamEmail}>{member.email}</span>
                      </span>
                      <span
                        className={`${styles.projectCreateTeamBadge} ${styles[`projectCreateTeamBadge_${member.tone}`]}`}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.projectCreatePreviewSection} aria-labelledby="project-preview-plan-title">
                <div className={styles.projectCreatePreviewSectionHeader}>
                  <h3 id="project-preview-plan-title">처리 계획</h3>
                </div>

                <ol className={styles.projectCreateProcessingList}>
                  {projectCreateProcessingPlan.map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                      <em>대기</em>
                    </li>
                  ))}
                </ol>
              </section>

              <div className={styles.projectCreateWarningBox} role="note">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path
                    d="M12 3.5 21 19H3L12 3.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M12 9v4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="16.8" r="1" fill="currentColor" />
                </svg>
                <span>
                  <strong>주의 사항</strong>
                  <span>선택한 영역의 면적이 50만 ㎡ 이상입니다. 처리 시간 및 저장 용량을 확인해주세요.</span>
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.projectCreateActionBar}>
          <button type="button" className={styles.projectCreateActionButton}>
            임시 저장
          </button>
          <button type="button" className={styles.projectCreateActionButton}>
            취소
          </button>
          <button type="button" className={styles.projectCreatePrimaryActionButton}>
            프로젝트 생성
          </button>
        </div>
      </div>
    </section>
  );
}
