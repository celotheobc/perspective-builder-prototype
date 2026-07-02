import { useEffect, useState } from 'react';
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

function ResultTable({ results, ran }) {
  if (results.error) {
    return (
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
    );
  }

  return (
    <div className={`${styles.resultTableWrap} ${ran ? styles.resultTableWrapUpdated : ''}`}>
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
  );
}

function PqlEditor({ pql, pqlValidated, results, resultsOnRun }) {
  const [pqlText, setPqlText] = useState(pql);
  const [validated, setValidated] = useState(false);
  const [displayResults, setDisplayResults] = useState(results);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    setPqlText(pql);
    setValidated(false);
    setDisplayResults(results);
    setHasRun(false);
  }, [pql, results]);

  const applyValidation = () => {
    if (validated) return;
    setPqlText(pqlValidated ?? pql);
    setValidated(true);
  };

  const handleRun = () => {
    if (!validated) applyValidation();
    setDisplayResults(resultsOnRun ?? results);
    setHasRun(true);
  };

  return (
    <>
      <div
        className={`${styles.pqlEditorWrap} ${validated ? styles.pqlEditorWrapValidated : ''}`}
      >
        <textarea
          className={styles.pqlTextarea}
          value={pqlText}
          onChange={(e) => setPqlText(e.target.value)}
          onFocus={applyValidation}
          onClick={applyValidation}
          spellCheck={false}
          aria-label="PQL preview editor"
          rows={5}
        />
        <button
          type="button"
          className={styles.pqlRunBtn}
          onClick={handleRun}
        >
          Run
        </button>
      </div>
      <ResultTable results={displayResults} ran={hasRun} />
    </>
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

  const {
    relationshipLabel,
    businessConsequences,
    dataImpact,
    pql,
    pqlValidated,
    results,
    resultsOnRun,
  } = preview;

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
        <PqlEditor
          pql={pql}
          pqlValidated={pqlValidated}
          results={results}
          resultsOnRun={resultsOnRun}
        />
      </section>
    </div>
  );
}
