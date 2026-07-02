import { useEffect, useRef } from 'react';
import styles from './CycleResolutionInspectorV7.module.css';

export default function CycleResolutionInspectorV7({
  rows,
  highlightedRelationshipId,
  previewRelationshipId,
  onHighlightRelationship,
  onPreviewImpact,
  onRemoveRelationship,
}) {
  const loopRows = rows.filter((r) => r.isConflicting);
  const cardRefs = useRef(new Map());
  const hoveredFromPanelRef = useRef(false);

  const restoreHighlight = () => {
    onHighlightRelationship(previewRelationshipId ?? null);
  };

  useEffect(() => {
    if (!highlightedRelationshipId || hoveredFromPanelRef.current) return;
    cardRefs.current.get(highlightedRelationshipId)?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [highlightedRelationshipId]);

  return (
    <ul className={styles.loopList}>
      {loopRows.map((row) => {
        const previewing = previewRelationshipId === row.id;
        const hovering =
          highlightedRelationshipId === row.id && !previewing;

        return (
          <li
            key={row.id}
            ref={(el) => {
              if (el) cardRefs.current.set(row.id, el);
              else cardRefs.current.delete(row.id);
            }}
          >
            <div
              className={`${styles.loopCard} ${previewing ? styles.loopCardPreviewing : ''} ${hovering ? styles.loopCardHover : ''}`}
              onMouseEnter={() => {
                hoveredFromPanelRef.current = true;
                onHighlightRelationship(row.id);
              }}
              onMouseLeave={() => {
                hoveredFromPanelRef.current = false;
                restoreHighlight();
              }}
            >
              <p className={styles.loopName}>{row.name}</p>


              <div className={styles.loopActions}>
                {onPreviewImpact && (
                  <button
                    type="button"
                    className={styles.loopPreviewPrimary}
                    onClick={() => onPreviewImpact(row.id)}
                  >
                    Preview consequences
                  </button>
                )}
                {onRemoveRelationship && (
                  <button
                    type="button"
                    className={styles.loopRemoveSecondary}
                    onClick={() => onRemoveRelationship(row.id)}
                  >
                    Remove relationship
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
