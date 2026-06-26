import styles from './ContextModelDetailPanel.module.css';

function ObjectIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.heroSvg} aria-hidden>
      <rect x="4" y="6" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.heroSvg} aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

function ProcessIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.heroSvg} aria-hidden>
      <rect x="3" y="5" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M11 8h2M11 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ContextModelDetailIcon({ kind }) {
  const kindClass =
    kind === 'event' ? styles.heroEvent : kind === 'process' ? styles.heroProcess : styles.heroObject;

  return (
    <div className={`${styles.heroIcon} ${kindClass}`} aria-hidden>
      {kind === 'event' && <EventIcon />}
      {kind === 'process' && <ProcessIcon />}
      {kind === 'object' && <ObjectIcon />}
    </div>
  );
}
