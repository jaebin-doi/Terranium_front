import styles from '../../../page.module.css';

export default function ThreeDigitalTwinPage() {
  return (
    <section className={styles.viewerCanvasWorkspace} aria-label="3D 디지털트윈 뷰어">
      <div className={styles.digitalTwinCanvas}>
        <img
          className={styles.digitalTwinScene}
          src="/assets/viewer/industrial-digital-twin-scene.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
