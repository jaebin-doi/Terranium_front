import styles from '../../page.module.css';

const projectCreateSteps = [
  '기본 정보',
  '위치/좌표',
  '데이터 구성',
  '팀/권한',
  '검토 및 생성'
];

export default function ProjectsPage() {
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
        <div className={styles.projectCreateBlankCanvas} />
      </div>
    </section>
  );
}
