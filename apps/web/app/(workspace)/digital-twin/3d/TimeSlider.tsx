'use client';

import { useState } from 'react';
import styles from '../../../page.module.css';

const timelineDates = [
  '2024-02-10',
  '2024-03-15',
  '2024-04-20',
  '2024-05-06',
  '2024-06-12',
  '2024-07-18',
  '2024-08-24'
] as const;

export function TimeSlider() {
  const [selectedDate, setSelectedDate] = useState<(typeof timelineDates)[number]>('2024-05-06');
  const selectedIndex = timelineDates.indexOf(selectedDate);
  const selectedPosition = `${(selectedIndex / (timelineDates.length - 1)) * 100}%`;

  const moveDate = (direction: -1 | 1) => {
    const nextIndex = Math.min(Math.max(selectedIndex + direction, 0), timelineDates.length - 1);
    setSelectedDate(timelineDates[nextIndex]);
  };

  return (
    <footer className={styles.timeSlider} aria-label="시간 슬라이더">
      <div className={styles.timeSliderTitle}>시간 슬라이더</div>

      <div className={styles.timePlaybackControls}>
        <button type="button" className={styles.timePlayButton} aria-label="재생">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
          </svg>
        </button>
        <button type="button" className={styles.timeStepButton} aria-label="이전 날짜" onClick={() => moveDate(-1)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={styles.timeSpeed}>1x</span>
        <button type="button" className={styles.timeStepButton} aria-label="다음 날짜" onClick={() => moveDate(1)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.timeTimeline}>
        <div className={styles.timeDateLabels}>
          {timelineDates.map((date) => (
            <button
              type="button"
              className={`${styles.timeDateLabel} ${date === selectedDate ? styles.timeDateLabelActive : ''}`}
              key={date}
              onClick={() => setSelectedDate(date)}
              aria-pressed={date === selectedDate}
            >
              {date}
            </button>
          ))}
        </div>
        <div className={styles.timeTrack} aria-hidden>
          <div className={styles.timeTrackTicks}>
            {Array.from({ length: 49 }, (_, index) => (
              <span className={index % 8 === 0 ? styles.timeTrackTickMajor : ''} key={index} />
            ))}
          </div>
          <span className={styles.timeHandle} style={{ left: selectedPosition }} />
        </div>
      </div>

      <button type="button" className={styles.timeCalendarButton} aria-label="촬영일 선택">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </footer>
  );
}
