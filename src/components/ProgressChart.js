import React from 'react';
import styles from './ProgressChart.module.css';

const ProgressChart = ({ percentage }) => {
  const dashArray = 283; // 2 * PI * 45 (circle radius)
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  
  return (
    <div className={styles.progressChartContainer}>
      <div className={styles.progressChart}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#3498db"
            strokeWidth="10"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className={styles.percentage}>
          {Math.round(percentage)}%
        </div>
      </div>
      <div className={styles.legend}>Overall Completion</div>
    </div>
  );
};

export default ProgressChart;
