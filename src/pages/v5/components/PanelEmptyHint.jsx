import PerspectiveIcon from '../../../components/icons/PerspectiveIcon';
import styles from './PanelEmptyHint.module.css';

function RelationshipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h6m2 0h6M13 12l-3-3m3 3l-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  perspective: PerspectiveIcon,
  relationship: RelationshipIcon,
};

export default function PanelEmptyHint({ variant = 'perspective', text }) {
  const Icon = ICONS[variant] ?? PerspectiveIcon;
  const iconSize = variant === 'perspective' ? 18 : 16;

  return (
    <div className={styles.hint}>
      <div className={styles.icon} aria-hidden>
        <Icon size={iconSize} />
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
