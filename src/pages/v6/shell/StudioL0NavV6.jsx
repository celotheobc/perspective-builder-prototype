import theoBotAvatar from '../../../assets/theobot-avatar.png';
import { useInventoryPlacement } from '../inventory/InventoryPlacementContext';
import { isBottomInventory } from '../inventory/inventoryPlacement';
import styles from '../../v3/shell/StudioL0Nav.module.css';
import v6Styles from './StudioL0NavV6.module.css';

const SKELETON_SLOTS = 4;

export default function StudioL0NavV6({ onVersionChange }) {
  const { placement, togglePlacement } = useInventoryPlacement();
  const bottomMode = isBottomInventory(placement);

  return (
    <nav className={styles.nav} aria-label="Celonis navigation">
      {Array.from({ length: SKELETON_SLOTS }, (_, i) => (
        <div key={i} className={styles.skeleton} aria-hidden />
      ))}
      <div className={styles.spacer} />
      <button
        type="button"
        className={`${v6Styles.placementTrigger} ${bottomMode ? v6Styles.placementRotated : ''}`}
        aria-label={
          bottomMode
            ? 'Inventory in bottom panel — switch to side panel'
            : 'Inventory in side panel — switch to bottom panel'
        }
        title={
          bottomMode
            ? 'Inventory: bottom panel (click for side)'
            : 'Inventory: side panel (click for bottom)'
        }
        aria-pressed={bottomMode}
        onClick={togglePlacement}
      />
      <div className={styles.avatarWrap}>
        <button
          type="button"
          className={styles.avatar}
          aria-label="Back to prototype home"
          title="Prototype home"
          onClick={() => onVersionChange?.('cover')}
        >
          <img
            src={theoBotAvatar}
            alt=""
            className={styles.avatarImage}
            width={32}
            height={32}
          />
        </button>
      </div>
    </nav>
  );
}
