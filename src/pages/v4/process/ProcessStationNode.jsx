import { memo, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import nodeStyles from '../../../components/graph/PerspectiveNode.module.css';
import styles from './ProcessStationNode.module.css';

const SIDES = [
  { position: Position.Top, id: 'top' },
  { position: Position.Right, id: 'right' },
  { position: Position.Bottom, id: 'bottom' },
  { position: Position.Left, id: 'left' },
];

function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function ProcessStationNodeComponent({ data }) {
  const {
    label,
    basketSelected,
    cmAssetPicker,
    laneColor = '#1b6fd1',
  } = data;

  const [returnHover, setReturnHover] = useState(false);

  useEffect(() => {
    if (!basketSelected) setReturnHover(false);
  }, [basketSelected]);

  return (
    <div
      className={[
        styles.root,
        nodeStyles.event,
        nodeStyles.included,
        nodeStyles.explorerSelectable,
        cmAssetPicker ? nodeStyles.cmAssetPicker : '',
        basketSelected ? nodeStyles.basketSelected : '',
        cmAssetPicker && returnHover ? nodeStyles.returnHover : '',
        basketSelected ? styles.selected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label={label}
      onMouseLeave={cmAssetPicker ? () => basketSelected && setReturnHover(true) : undefined}
    >
      {SIDES.map(({ position, id }) => (
        <span key={id}>
          <Handle type="target" position={position} id={`t-${id}`} className={styles.handle} />
          <Handle type="source" position={position} id={`s-${id}`} className={styles.handle} />
        </span>
      ))}

      <div className={styles.station} style={{ '--lane-color': laneColor }}>
        <div className={`${styles.stationInner} ${nodeStyles.puckTop}`}>
          {cmAssetPicker ? (
            <>
              <span className={nodeStyles.cmPickerIcon} aria-hidden>
                <EventIcon />
              </span>
              <span className={`${nodeStyles.cmPickerPlus} ${nodeStyles.cmPickerRaised}`} aria-hidden>
                +
              </span>
              <span className={nodeStyles.cmPickerCheck} aria-hidden>
                ✓
              </span>
              <span className={`${nodeStyles.cmPickerMinus} ${nodeStyles.cmPickerRaised}`} aria-hidden>
                −
              </span>
            </>
          ) : (
            <EventIcon />
          )}
        </div>
      </div>

      <div className={styles.label}>
        <span className={styles.labelText}>{label}</span>
      </div>
    </div>
  );
}

export default memo(ProcessStationNodeComponent);
