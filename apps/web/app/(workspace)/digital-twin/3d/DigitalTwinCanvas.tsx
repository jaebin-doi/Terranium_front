'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import styles from '../../../page.module.css';

const MIN_SCALE = 0.3;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.05;
const GRID_MULTIPLIER = 20;

type Transform = {
  scale: number;
  offset: { x: number; y: number };
};

const INITIAL_TRANSFORM: Transform = {
  scale: 1,
  offset: { x: 0, y: 0 }
};

export function DigitalTwinCanvas() {
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const draggingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const direction = event.deltaY > 0 ? -1 : 1;

      setTransform((current) => {
        const next = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, current.scale + direction * ZOOM_STEP)
        );
        if (next === current.scale) return current;
        const factor = next / current.scale;
        return {
          scale: next,
          offset: {
            x: mx - factor * (mx - current.offset.x),
            y: my - factor * (my - current.offset.y)
          }
        };
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - lastPointRef.current.x;
    const dy = event.clientY - lastPointRef.current.y;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    setTransform((current) => ({
      ...current,
      offset: { x: current.offset.x + dx, y: current.offset.y + dy }
    }));
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  const fitImageToViewport = (iw: number, ih: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (cw === 0 || ch === 0) return;
    const fitScale = Math.min(cw / iw, ch / ih);
    setImageSize({ width: iw, height: ih });
    setTransform({
      scale: fitScale,
      offset: {
        x: (cw - iw * fitScale) / 2,
        y: (ch - ih * fitScale) / 2
      }
    });
  };

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    fitImageToViewport(img.naturalWidth, img.naturalHeight);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      fitImageToViewport(img.naturalWidth, img.naturalHeight);
    }
  }, []);

  const gridWidth = imageSize ? imageSize.width * GRID_MULTIPLIER : 0;
  const gridHeight = imageSize ? imageSize.height * GRID_MULTIPLIER : 0;

  return (
    <div
      ref={containerRef}
      className={styles.digitalTwinCanvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div
        className={styles.canvasWorld}
        style={{
          transform: `translate(${transform.offset.x}px, ${transform.offset.y}px) scale(${transform.scale})`
        }}
      >
        {imageSize ? (
          <div
            className={styles.canvasGrid}
            style={{
              left: `${-gridWidth / 2}px`,
              top: `${-gridHeight / 2}px`,
              width: `${gridWidth}px`,
              height: `${gridHeight}px`
            }}
            aria-hidden
          />
        ) : null}
        <img
          ref={imgRef}
          className={styles.digitalTwinScene}
          src="/assets/viewer/industrial-digital-twin-scene.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={handleImageLoad}
        />
        {/*
          NOTE: 측정 도형 / 라벨 / 오버레이 등 추후 추가되는 요소는 모두
          이 .canvasWorld 안에 world 좌표 기준으로 그리면 zoom·pan에 자동으로 따라간다.
        */}
      </div>
    </div>
  );
}
