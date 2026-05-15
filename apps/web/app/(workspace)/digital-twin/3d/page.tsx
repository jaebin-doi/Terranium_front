import styles from '../../../page.module.css';
import { DigitalTwinCanvas } from './DigitalTwinCanvas';
import { LayerSlider } from './LayerSlider';
import { ObjectPropertyPanel } from './ObjectPropertyPanel';
import { TimeSlider } from './TimeSlider';

export default function ThreeDigitalTwinPage() {
  return (
    <section className={styles.viewerCanvasWorkspace} aria-label="3D 디지털트윈 뷰어">
      <div className={styles.viewerContentRow}>
        <div className={styles.viewerMainColumn}>
          <DigitalTwinCanvas />
          <TimeSlider />
        </div>
        <ObjectPropertyPanel />
      </div>
      <LayerSlider />
    </section>
  );
}
