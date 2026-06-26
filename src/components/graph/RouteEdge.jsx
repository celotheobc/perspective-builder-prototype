import { memo, useCallback, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
} from '@xyflow/react';
import { getRelationshipPrunePreview } from '../../data/cycleDetection';
import { edgeMarker, edgePathStyle, getEdgeVisual } from '../../utils/edgeVisual';
import styles from './RouteEdge.module.css';

function RouteEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const {
    included,
    potential,
    pruned,
    highlightCycle,
    showScissors,
    onPrune,
    relId,
    isPreviewBridge,
    previewBridgeCreatesCycle,
    highlightFromTable,
    highlightFromTableCycle,
    isInspectorSelected,
    contextOverview,
    directPath,
  } = data ?? {};

  const [hovered, setHovered] = useState(false);

  const visual = getEdgeVisual({
    included,
    potential,
    pruned,
    highlightCycle,
    previewRemove: hovered,
    isPreviewBridge,
    previewBridgeCreatesCycle,
    highlightFromTable,
    highlightFromTableCycle,
    contextOverview,
  });

  const useStraight = Boolean(
    contextOverview ||
    directPath ||
    isPreviewBridge ||
      highlightFromTable ||
      potential ||
      highlightCycle ||
      (included && !highlightCycle),
  );

  let sx = sourceX;
  let sy = sourceY;
  let tx = targetX;
  let ty = targetY;

  let edgePath;
  let labelX;
  let labelY;

  if (useStraight) {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
    });
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
      sourcePosition,
      targetPosition,
      borderRadius: 16,
    });
  }

  const edgeClass = [
    styles.edge,
    included && styles.included,
    potential && !isPreviewBridge && styles.potential,
    pruned && styles.pruned,
    highlightCycle && styles.cycle,
    highlightFromTable &&
      (highlightFromTableCycle
        ? styles.tableHighlightCycle
        : included
          ? styles.tableHighlight
          : styles.tableHighlightMuted),
    isInspectorSelected && styles.inspectorSelected,
    isPreviewBridge &&
      (previewBridgeCreatesCycle
        ? styles.previewBridgeCycle
        : styles.previewBridgeSafe),
    hovered && styles.previewRemove,
    highlightFromTableCycle && styles.previewRemove,
  ]
    .filter(Boolean)
    .join(' ');

  const preview = relId ? getRelationshipPrunePreview(relId) : null;
  const labelTransform = `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`;

  const handleScissorsEnter = useCallback(() => setHovered(true), []);
  const handleScissorsLeave = useCallback(() => setHovered(false), []);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={edgeClass}
        style={edgePathStyle(visual)}
        markerEnd={edgeMarker(visual.markerColor)}
        interactionWidth={14}
      />
      {showScissors && !pruned && (
        <EdgeLabelRenderer>
          <div className={styles.labelWrap} style={{ transform: labelTransform }}>
            <div className={styles.scissorsWrap}>
              <button
                type="button"
                className={`${styles.edgeScissors} ${hovered ? styles.edgeScissorsActive : ''}`}
                aria-label={preview?.title}
                onClick={() => onPrune?.(relId)}
                onMouseEnter={handleScissorsEnter}
                onMouseLeave={handleScissorsLeave}
                onFocus={handleScissorsEnter}
                onBlur={handleScissorsLeave}
              >
                ✂
              </button>
              {preview && (
                <span className={styles.pruneTooltip} role="tooltip">
                  <span className={styles.tooltipTitle}>{preview.title}</span>
                  <span className={styles.tooltipDetail}>{preview.detail}</span>
                </span>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(RouteEdgeComponent);
