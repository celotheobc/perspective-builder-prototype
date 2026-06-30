import { objects, SUGGESTED_START_OBJECTS } from '../../../data/mockData';
import PerspectiveIcon from '../../../components/icons/PerspectiveIcon';
import PerspectiveStartSearch, { START_PROCESSES } from './PerspectiveStartSearch';
import styles from '../../../components/configuration/EmptyState.module.css';
import localStyles from './EmptyStateV5.module.css';

function ObjectChipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ProcessChipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8.2 11.2l6.6-3.8M8.2 12.8l6.6 3.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StartChip({ kind, children, onClick }) {
  return (
    <button
      type="button"
      className={localStyles.startChip}
      onClick={onClick}
    >
      <span
        className={`${localStyles.chipIcon} ${
          kind === 'process' ? localStyles.chipIconProcess : localStyles.chipIconObject
        }`}
        aria-hidden
      >
        {kind === 'process' ? <ProcessChipIcon /> : <ObjectChipIcon />}
      </span>
      <span className={localStyles.chipLabel}>{children}</span>
    </button>
  );
}

export default function EmptyStateV5({ onAddObject, onStartFromProcess, centered = false }) {
  const suggested = SUGGESTED_START_OBJECTS.map((id) =>
    objects.find((o) => o.id === id),
  ).filter(Boolean);

  return (
    <div className={`${centered ? styles.emptyCentered : styles.empty} ${localStyles.root}`}>
      <div className={localStyles.content}>
      <div className={localStyles.iconHero} aria-hidden>
        <div className={localStyles.iconInner}>
          <PerspectiveIcon size={36} />
        </div>
      </div>
      <h3 className={styles.title}>Start building your perspective</h3>
      <p className={`${styles.subtitle} ${localStyles.subtitleWide}`}>
        Begin with an object type or an existing process. You can refine your
        perspective at any time.
      </p>
      <div className={`${styles.searchBlock} ${localStyles.searchBlock}`}>
        <PerspectiveStartSearch
          onSelectObject={onAddObject}
          onSelectProcess={onStartFromProcess}
        />
      </div>
      <div className={localStyles.chipSection}>
        <span className={localStyles.sectionLabel}>Common starting objects</span>
        <div className={localStyles.chipRow}>
          {suggested.map((obj) => (
            <StartChip key={obj.id} kind="object" onClick={() => onAddObject(obj.id)}>
              {obj.name}
            </StartChip>
          ))}
        </div>
      </div>

      <div className={localStyles.processSection}>
        <span className={localStyles.sectionLabel}>Existing processes</span>
        <div className={localStyles.chipRow}>
          {START_PROCESSES.map((process) => (
            <StartChip
              key={process.id}
              kind="process"
              onClick={() => onStartFromProcess?.(process.id)}
            >
              {process.name}
            </StartChip>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
