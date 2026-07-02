import { useState } from 'react';
import styles from './ImpactPreviewPanel.module.css';

const MAX_VISIBLE_CONSEQUENCES = 3;

const STATUS_CLASS = {
  good: styles.statusGood,
  warn: styles.statusWarn,
  bad: styles.statusBad,
};

function BusinessConsequences({ items }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > MAX_VISIBLE_CONSEQUENCES;
  const visible = expanded || !hasMore ? items : items.slice(0, MAX_VISIBLE_CONSEQUENCES);

  return (
    <>
      <ul className={styles.consequenceList}>
        {visible.map((item) => (
          <li key={item.text} className={styles.consequenceItem}>
            <span
              className={`${styles.statusDot} ${STATUS_CLASS[item.status] ?? styles.statusWarn}`}
              aria-hidden
            />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={styles.showMore}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Show all'}
        </button>
      )}
    </>
  );
}

function DataImpactList({ items }) {
  return (
    <ul className={styles.dataImpactList}>
      {items.map((item) => (
        <li key={item.text} className={styles.dataImpactItem}>
          <span
            className={`${styles.statusDot} ${STATUS_CLASS[item.status] ?? styles.statusWarn}`}
            aria-hidden
          />
          <span className={styles.dataImpactText}>
            {item.text}
            {item.detail && <span className={styles.dataImpactDetail}> ({item.detail})</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ImpactPreviewPanel({ preview }) {
  if (!preview) {
    return (
      <p className={styles.empty}>
        Choose a resolution and select Preview consequences to inspect outcomes here.
      </p>
    );
  }

  const { relationshipLabel, businessConsequences, dataImpact, pql, results } = preview;

  return (
    <div className={styles.panel} key={relationshipLabel}>
      <section className={styles.summarySection} aria-label="Resolution summary">
        <div className={styles.summaryGrid}>
          <div className={styles.removalColumn} aria-labelledby="resolution-summary-heading">
            <p id="resolution-summary-heading" className={styles.blockLabel}>
              If you remove
            </p>
            <h3 className={styles.relationshipTitle}>{relationshipLabel}</h3>
          </div>

          <div className={styles.impactColumn} aria-labelledby="business-impact-heading">
            <h4 id="business-impact-heading" className={styles.blockLabel}>
              Business impact
            </h4>
            <BusinessConsequences items={businessConsequences} />
          </div>

          <div className={styles.impactColumn} aria-labelledby="data-impact-heading">
            <h4 id="data-impact-heading" className={styles.blockLabel}>
              Data impact
            </h4>
            <DataImpactList items={dataImpact} />
          </div>
        </div>
      </section>

      <section className={styles.pqlSection} aria-labelledby="pql-preview-heading">
        <h4 id="pql-preview-heading" className={styles.blockLabel}>
          PQL preview
        </h4>
        <pre className={styles.pqlEditor}>{pql}</pre>
      </section>

      <section className={styles.resultSection} aria-label="Query result">
        {results.error ? (
          <div className={styles.resultTableWrap}>
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td className={styles.resultErrorCell} colSpan={1} role="alert">
                    <span className={styles.resultErrorIcon} aria-hidden>!</span>
                    {results.error}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.resultTableWrap}>
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  {results.columns.map((col) => (
                    <th key={col} scope="col">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className={cell === '—' ? styles.cellWarn : undefined}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
