import styles from './PrototypeCover.module.css';

const VERSIONS = [
  {
    id: 'v1',
    title: 'Graph-first prototype',
    description:
      'Original stacked layout. Start from an empty Perspective and build progressively from a seed object.',
    tag: 'v1',
  },
  {
    id: 'v2',
    title: 'Asset layout exploration',
    description:
      'IDE-style shell: graph canvas, contextual right inspector, and bottom inventory panel.',
    tag: 'v2',
  },
  {
    id: 'v3',
    title: 'Create from Context Model selection',
    description:
      'Select objects and events from the wider Context Model, then refine the resulting Perspective on the graph.',
    tag: 'v3',
    featured: true,
  },
];

export default function PrototypeCover({ onSelectVersion }) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Offline prototype</p>
          <h1 className={styles.title}>Perspective Builder</h1>
          <p className={styles.subtitle}>
            Three iterations exploring how users create and refine Perspectives — scoped lenses
            over the Context Model.
          </p>
        </header>

        <div className={styles.grid}>
          {VERSIONS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${styles.card} ${v.featured ? styles.cardFeatured : ''}`}
              onClick={() => onSelectVersion(v.id)}
            >
              <span className={styles.cardTag}>{v.tag}</span>
              <h2 className={styles.cardTitle}>{v.title}</h2>
              <p className={styles.cardDesc}>{v.description}</p>
              <span className={styles.cardCta}>Open prototype →</span>
            </button>
          ))}
        </div>

        <p className={styles.footnote}>
          Each version is preserved so approaches can be compared. v3 demonstrates the
          &ldquo;shopping basket&rdquo; creation route.
        </p>
      </div>
    </div>
  );
}
