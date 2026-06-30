import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { objects } from '../../../data/mockData';
import styles from './PerspectiveStartSearch.module.css';

const PROCESSES = [
  { id: 'order-to-cash', name: 'Order to Cash' },
  { id: 'procure-to-pay', name: 'Procure to Pay' },
  { id: 'accounts-payable', name: 'Accounts Payable' },
];

const DEFAULT_OBJECT_IDS = ['customer', 'sales-order', 'delivery', 'invoice'];

function matchesQuery(name, query) {
  return name.toLowerCase().includes(query);
}

function ObjectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ProcessIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8.2 11.2l6.6-3.8M8.2 12.8l6.6 3.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function PerspectiveStartSearch({ onSelectObject, onSelectProcess }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const onDocPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        close();
      }
    };

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const { objectResults, processResults } = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return {
        objectResults: DEFAULT_OBJECT_IDS.map((id) => objects.find((o) => o.id === id)).filter(
          Boolean,
        ),
        processResults: PROCESSES,
      };
    }

    return {
      objectResults: objects.filter(
        (o) =>
          matchesQuery(o.name, q) ||
          matchesQuery(o.domain, q),
      ),
      processResults: PROCESSES.filter((p) => matchesQuery(p.name, q)),
    };
  }, [query]);

  const hasResults = objectResults.length > 0 || processResults.length > 0;

  return (
    <div className={styles.wrap} ref={rootRef}>
      <input
        type="search"
        className={styles.input}
        placeholder="Search objects or processes…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search objects or processes"
        aria-expanded={open}
        aria-haspopup="listbox"
      />
      {open && hasResults && (
        <div className={styles.results} role="listbox">
          {objectResults.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Objects</p>
              <ul className={styles.groupList}>
                {objectResults.map((obj) => (
                  <li key={obj.id}>
                    <button
                      type="button"
                      className={styles.resultItem}
                      role="option"
                      onClick={() => {
                        onSelectObject(obj.id);
                        setQuery('');
                        close();
                      }}
                    >
                      <span className={`${styles.resultIcon} ${styles.resultIconObject}`}>
                        <ObjectIcon />
                      </span>
                      <span className={styles.resultName}>{obj.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {processResults.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Processes</p>
              <ul className={styles.groupList}>
                {processResults.map((process) => (
                  <li key={process.id}>
                    <button
                      type="button"
                      className={styles.resultItem}
                      role="option"
                      onClick={() => {
                        onSelectProcess(process.id);
                        setQuery('');
                        close();
                      }}
                    >
                      <span className={`${styles.resultIcon} ${styles.resultIconProcess}`}>
                        <ProcessIcon />
                      </span>
                      <span className={styles.resultName}>{process.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { PROCESSES as START_PROCESSES };
