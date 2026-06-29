import styles from './PrototypeCover.module.css';

const VERSIONS = [
  {
    id: 'v1',
    title: 'Stacked Layout',
    description:
      'Original layout that preceeded the 555 workshop. Start from an empty Perspective and build progressively from a seed object. v1 uses fixed, stacked config surfaces.',
    tag: 'version 1',
  },
  {
    id: 'v2',
    title: 'IDE-style asset shell',
    description:
      'v2 introduces a selection-driven inspector. The collapsible right panel updates based on whatever is active on the canvas (Perspective, Object, Relationship, etc).',
    tag: 'version 2',
  },
  {
    id: 'v3',
    title: 'Create from Context Model selection',
    description:
      'As v2, but with a new two-stage flow: select assets from the wider Context Model, then refine the resulting Perspective.',
    tag: 'version 3',
  },
];

export default function PrototypeCover({ onSelectVersion }) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Perspective Builder</h1>
          <p className={styles.subtitle}>
            Create and refine Perspectives within the Context Model.
          </p>
        </header>

        <div className={styles.grid}>
          {VERSIONS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={styles.card}
              onClick={() => onSelectVersion(v.id)}
            >
              <span className={styles.cardTag}>{v.tag}</span>
              <h2 className={styles.cardTitle}>{v.title}</h2>
              <p className={styles.cardDesc}>{v.description}</p>
              <span className={styles.cardCta}>Open</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
