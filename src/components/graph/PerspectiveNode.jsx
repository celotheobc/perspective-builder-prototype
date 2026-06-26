import { memo, useEffect, useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './PerspectiveNode.module.css';

const SIDES = [
  { position: Position.Top, id: 'top' },
  { position: Position.Right, id: 'right' },
  { position: Position.Bottom, id: 'bottom' },
  { position: Position.Left, id: 'left' },
];

function NodeIcon({ kind, isHub }) {
  if (kind === 'metric') {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'eventSource') {
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
  if (kind === 'process') {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden>
        <rect x="3" y="5" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M11 8h2M11 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (isHub) {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden>
        <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden>
      <rect x="4" y="6" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PerspectiveNodeComponent({ data }) {
  const {
    label,
    kind,
    state,
    isHub,
    showPlus,
    onPlusClick,
    canRefocus,
    onRefocusExpansion,
    isSelectedContext,
    isInspectorSelected,
    inspectorSelectionMode,
    visualVariant,
    basketSelected,
    cmNeighbor,
    explorerUnselectable,
    explorerMuted,
    explorerSelectable,
    cmAssetPicker,
    showLabel = true,
  } = data;

  const kindClass =
    kind === 'eventSource'
      ? styles.event
      : kind === 'metric'
        ? styles.metric
        : kind === 'process'
          ? styles.process
          : styles.object;

  const stateClass =
    state === 'included'
      ? styles.included
      : state === 'pending'
        ? styles.pending
        : state === 'bridgePreview'
          ? styles.bridgePreview
          : state === 'ghost'
          ? styles.ghost
          : state === 'dimmed'
            ? styles.dimmed
            : styles.available;

  const showSelectionFrame =
    isSelectedContext || isInspectorSelected || basketSelected;

  const [hovering, setHovering] = useState(false);
  const [leftAfterSelect, setLeftAfterSelect] = useState(false);

  useEffect(() => {
    if (!basketSelected) {
      setLeftAfterSelect(false);
    }
  }, [basketSelected]);

  const pickerOverlay = useMemo(() => {
    if (!cmAssetPicker) return null;
    if (!basketSelected && hovering) return 'plus';
    if (basketSelected && hovering && leftAfterSelect) return 'minus';
    if (basketSelected) return 'check';
    return null;
  }, [cmAssetPicker, basketSelected, hovering, leftAfterSelect]);

  const handleAssetPickerEnter = () => {
    if (!cmAssetPicker) return;
    setHovering(true);
  };

  const handleAssetPickerLeave = () => {
    if (!cmAssetPicker) return;
    setHovering(false);
    if (basketSelected) {
      setLeftAfterSelect(true);
    }
  };

  return (
    <div
      className={[
        styles.root,
        kindClass,
        stateClass,
        isHub ? styles.hub : '',
        canRefocus ? styles.refocusable : '',
        isSelectedContext ? styles.contextSelected : '',
        isInspectorSelected ? styles.inspectorSelected : '',
        visualVariant === 'explorer' ? styles.explorer : '',
        basketSelected ? styles.basketSelected : '',
        cmNeighbor ? styles.cmNeighbor : '',
        explorerUnselectable ? styles.explorerUnselectable : '',
        explorerMuted ? styles.explorerMuted : '',
        explorerSelectable ? styles.explorerSelectable : '',
        cmAssetPicker ? styles.cmAssetPicker : '',
        !showLabel ? styles.labelHidden : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label={label}
      onMouseEnter={cmAssetPicker ? handleAssetPickerEnter : undefined}
      onMouseLeave={cmAssetPicker ? handleAssetPickerLeave : undefined}
      onClick={
        canRefocus && !inspectorSelectionMode
          ? (e) => {
              e.stopPropagation();
              onRefocusExpansion?.();
            }
          : undefined
      }
      onKeyDown={
        canRefocus && !inspectorSelectionMode
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRefocusExpansion?.();
              }
            }
          : undefined
      }
      tabIndex={canRefocus && !inspectorSelectionMode ? 0 : undefined}
      title={
        state === 'pending'
          ? 'Choose a connection path to link this object'
          : state === 'bridgePreview'
            ? 'Will be added with this connection path'
            : canRefocus && !inspectorSelectionMode
              ? 'Show next steps from this object'
              : undefined
      }
    >
      {SIDES.map(({ position, id }) => (
        <span key={id}>
          <Handle
            type="target"
            position={position}
            id={`t-${id}`}
            className={styles.handle}
          />
          <Handle
            type="source"
            position={position}
            id={`s-${id}`}
            className={styles.handle}
          />
        </span>
      ))}

      <div className={styles.floorShadow} aria-hidden />

      <div className={styles.nodeContent}>
        {showSelectionFrame && (
          <div className={styles.selectionFrame} aria-hidden />
        )}

        <div className={styles.puck}>
          <div className={styles.puckTop}>
            {cmAssetPicker ? (
              <>
                {!pickerOverlay && <NodeIcon kind={kind} isHub={isHub} />}
                {pickerOverlay === 'plus' && (
                  <span
                    className={`${styles.cmPickerPlus} ${styles.cmPickerRaised}`}
                    aria-hidden
                  >
                    +
                  </span>
                )}
                {pickerOverlay === 'check' && (
                  <span className={styles.cmPickerCheck} aria-hidden>
                    ✓
                  </span>
                )}
                {pickerOverlay === 'minus' && (
                  <span
                    className={`${styles.cmPickerMinus} ${styles.cmPickerRaised}`}
                    aria-hidden
                  >
                    −
                  </span>
                )}
              </>
            ) : (
              <NodeIcon kind={kind} isHub={isHub} />
            )}
            {showPlus && (
              <button
                type="button"
                className={styles.plusBtn}
                aria-label={`Add ${label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlusClick?.();
                }}
              >
                +
              </button>
            )}
          </div>
          <div className={styles.puckSide} aria-hidden />
        </div>

        {showLabel && (
          <div className={styles.label}>
            <span className={styles.labelText}>{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(PerspectiveNodeComponent);
