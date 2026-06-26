import styles from './TypeIndicator.module.css';

/** Small shape matching graph node types (object / event / metric). */
export default function TypeIndicator({ kind }) {
  const variant =
    kind === 'metric' || kind === 'metrics'
      ? 'metric'
      : kind === 'eventSource' || kind === 'events'
        ? 'event'
        : kind === 'process'
          ? 'process'
          : 'object';

  return (
    <span
      className={`${styles.dot} ${styles[variant]}`}
      aria-hidden
    />
  );
}
