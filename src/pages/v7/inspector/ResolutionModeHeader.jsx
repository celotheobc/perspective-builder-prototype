import styles from './ResolutionModeHeader.module.css';

export default function ResolutionModeHeader({ resolutionCount }) {
  return (
    <div className={styles.header}>
      <p className={styles.eyebrow}>Action required</p>
      <h2 className={styles.title}>Resolve cycle</h2>
      <p className={styles.message}>
        <span>{resolutionCount} possible resolutions found.</span>
        <span>Choose which relationship should be removed.</span>
      </p>
    </div>
  );
}
