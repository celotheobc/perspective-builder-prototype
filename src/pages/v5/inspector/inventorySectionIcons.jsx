import styles from './RightInspector.module.css';

export function ObjectTypeSectionIcon() {
  return (
    <svg viewBox="0 0 20 20" className={styles.inventoryIconSvg} aria-hidden>
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="0.75" fill="#1b6fd1" />
    </svg>
  );
}

export function EventSourceSectionIcon() {
  return (
    <svg viewBox="0 0 20 20" className={styles.inventoryIconSvg} aria-hidden>
      <circle cx="6" cy="10" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="10" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.25 10h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 6.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
