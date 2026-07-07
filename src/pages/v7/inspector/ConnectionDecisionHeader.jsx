import styles from './ResolutionModeHeader.module.css';

export default function ConnectionDecisionHeader({ objectName, pathCount }) {
  const totalChoices = pathCount + 1;

  return (
    <div className={styles.header}>
      <p className={`${styles.eyebrow} ${styles.eyebrowDecision}`}>Decision required</p>
      <h2 className={styles.title}>Choose how to connect {objectName}</h2>
      <p className={styles.message}>
        <span>
          {totalChoices} possible connection {totalChoices === 1 ? 'path' : 'paths'} found.
        </span>
        <span>Preview the consequences of each option before adding it.</span>
      </p>
    </div>
  );
}
