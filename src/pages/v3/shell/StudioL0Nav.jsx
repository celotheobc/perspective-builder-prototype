import PrototypeVersionPicker from '../../../components/layout/PrototypeVersionNav';
import styles from './StudioL0Nav.module.css';

const NAV_ITEMS = [
  { id: 'search', label: 'Search', glyph: '⌕' },
  { id: 'home', label: 'Home', glyph: '⌂' },
  { id: 'files', label: 'Files', glyph: '▣' },
  { id: 'studio', label: 'Studio', glyph: 'studio', active: true },
  { id: 'data', label: 'Data', glyph: '◫' },
  { id: 'more', label: 'More', glyph: '⋯' },
];

function StudioGlyph({ glyph }) {
  if (glyph === 'studio') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8.6 10.8l5.8-3.2M8.6 13.2l5.8 3.2" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return <span className={styles.glyph}>{glyph}</span>;
}

export default function StudioL0Nav({ onVersionChange }) {
  return (
    <nav className={styles.nav} aria-label="Celonis navigation">
      <div className={styles.logo}>C</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.active ? styles.active : styles.item}
          aria-label={item.label}
          title={item.label}
        >
          <StudioGlyph glyph={item.glyph} />
        </button>
      ))}
      <div className={styles.spacer} />
      <button type="button" className={styles.item} aria-label="Settings" title="Settings">
        <span className={styles.glyph}>⚙</span>
      </button>
      <PrototypeVersionPicker version="v3" onVersionChange={onVersionChange} />
      <button type="button" className={styles.avatar} aria-label="Profile" title="Profile">
        BC
      </button>
    </nav>
  );
}
