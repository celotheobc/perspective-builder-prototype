import { STUDIO_CONTEXT_MODEL } from './studioAssets';
import styles from './StudioHeader.module.css';

export default function StudioHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <button type="button" className={styles.breadcrumbLink}>
          Context Models
        </button>
        <span className={styles.breadcrumbSep} aria-hidden>
          ›
        </span>
        <span className={styles.breadcrumbCurrent}>{STUDIO_CONTEXT_MODEL}</span>
      </nav>

      <div className={styles.actions}>
        <button type="button" className={styles.versionBtn} aria-haspopup="listbox">
          <span className={styles.versionHash}>35b93a2</span>
          <span className={styles.versionCaret} aria-hidden>
            ▾
          </span>
        </button>
        <button type="button" className={styles.createVersion}>
          Create version
          <span className={styles.badge}>9</span>
        </button>
        <button type="button" className={styles.deploy}>
          Deploy
        </button>
        <button type="button" className={styles.avatar} aria-label="Profile">
          <span className={styles.avatarDot} />
        </button>
      </div>
    </header>
  );
}
