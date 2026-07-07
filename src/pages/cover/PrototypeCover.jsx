import { useState } from 'react';
import PerspectivePuckIcon from '../../components/icons/PerspectivePuckIcon';
import styles from './PrototypeCover.module.css';

const VERSIONS = [
  {
    id: 'v7',
    title: 'Cycle resolution consequences preview',
    description:
      'Refines cycle resolution into an investigative flow: choose a possible resolution in the right panel, preview consequences in the bottom panel, then commit when confident.',
    tag: 'v7',
  },
  {
    id: 'v6',
    title: 'Inventory placement experiment',
    description:
      'Renamed inspector tabs (Overview / Inspect) and a prototype toggle to compare side-panel vs bottom-panel inventory placement.',
    tag: 'v6',
  },
  {
    id: 'v5',
    title: 'Panel rebalance + process start',
    description:
      'Included objects/events in the right inspector, diagnostics in the bottom panel, consequence-aware cycle resolution, and start-from-process on the empty perspective screen.',
    tag: 'v5',
  },
  {
    id: 'v4',
    title: 'Create Perspective from Process',
    description:
      'Process asset page where you can create a Perspective from the entire process or a selected subset of its objects and events.',
    tag: 'v4',
  },
  {
    id: 'v3',
    title: 'Create from Context Model selection',
    description:
      'New two-stage flow: select assets from the wider Context Model, then refine the resulting Perspective.',
    tag: 'v3',
  },
  {
    id: 'v2',
    title: 'IDE-style asset shell',
    description:
      'Selection-driven inspector. The collapsible right panel updates based on whatever is active on the canvas (Perspective, Object, Relationship, etc).',
    tag: 'v2',
  },
  {
    id: 'v1',
    title: 'Stacked Layout',
    description:
      'Original layout that preceeded the 555 workshop. Start from an empty Perspective and build progressively from a seed object. v1 uses fixed, stacked config surfaces.',
    tag: 'v1',
  },
];

const DEFAULT_EXPANDED = new Set();

const [FEATURED_VERSION, ...ARCHIVE_VERSIONS] = VERSIONS;

function ExpandChevron({ expanded }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      className={`${styles.expandChevron}${expanded ? ` ${styles.expandChevronOpen}` : ''}`}
    >
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VersionPanel({
  v,
  isExpanded,
  featured = false,
  inList = false,
  launchOnClick = false,
  onToggle,
  onKeyDown,
  onSelectVersion,
}) {
  const showDescription = launchOnClick || isExpanded;

  const handleClick = () => {
    if (launchOnClick) {
      onSelectVersion(v.id);
      return;
    }
    onToggle(v.id);
  };

  const handleKeyDown = (e) => {
    if (launchOnClick) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectVersion(v.id);
      }
      return;
    }
    onKeyDown(e, v.id);
  };

  return (
    <article
      className={`${styles.item}${featured ? ` ${styles.itemFeatured}` : ''}${
        inList ? ` ${styles.itemInList}` : ''
      }${launchOnClick ? ` ${styles.itemLaunchable}` : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={launchOnClick ? undefined : isExpanded}
      aria-label={launchOnClick ? `Open ${v.title}` : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.headerRow}>
        {inList && (
          <span className={styles.expandChevronWrap}>
            <ExpandChevron expanded={isExpanded} />
          </span>
        )}
        <div className={styles.rowMain}>
          <h2 className={styles.versionTitle}>{v.title}</h2>
          <span className={styles.versionChip}>{v.tag}</span>
        </div>
        <button
          type="button"
          className={styles.openBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSelectVersion(v.id);
          }}
        >
          Open
        </button>
      </div>

      {showDescription && <p className={styles.description}>{v.description}</p>}
    </article>
  );
}

export default function PrototypeCover({ onSelectVersion }) {
  const [expanded, setExpanded] = useState(() => new Set(DEFAULT_EXPANDED));

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCardKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpanded(id);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.brandMark} aria-hidden>
            <PerspectivePuckIcon size={52} />
          </div>
          <h1 className={styles.title}>Perspective Builder</h1>
          <p className={styles.subtitle}>
            Create and refine Perspectives within the Context Model.
          </p>
        </header>

        <div className={styles.list}>
          <VersionPanel
            v={FEATURED_VERSION}
            isExpanded
            featured
            launchOnClick
            onToggle={toggleExpanded}
            onKeyDown={handleCardKeyDown}
            onSelectVersion={onSelectVersion}
          />

          <div className={styles.archiveList} role="list">
            {ARCHIVE_VERSIONS.map((v) => (
              <VersionPanel
                key={v.id}
                v={v}
                isExpanded={expanded.has(v.id)}
                inList
                onToggle={toggleExpanded}
                onKeyDown={handleCardKeyDown}
                onSelectVersion={onSelectVersion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
