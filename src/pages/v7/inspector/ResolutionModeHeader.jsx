import styles from './ResolutionModeHeader.module.css';

export default function ResolutionModeHeader() {
  return (
    <div className={styles.header}>
      <p className={styles.eyebrow}>Action required</p>
      <h2 className={styles.title}>Resolve cycle</h2>
      <p className={styles.message}>
        <span>A recommended option is available below.</span>
        <span>Preview consequences, or compare alternatives before removing a relationship.</span>
      </p>
    </div>
  );
}
