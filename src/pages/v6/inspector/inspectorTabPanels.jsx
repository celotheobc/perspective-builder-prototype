import { agentContextMarkdown, assetMetadata } from '../../../data/mockData';
import { MetaRows, TextBlock } from '../../v5/inspector/metaPanelParts';
import { EventSourceIcon, ObjectTypeIcon } from '../../v5/inspector/inventorySectionIcons';
import {
  CacheTab,
  InventoryTable,
} from '../../v5/inspector/inspectorTabPanels';
import { isSideInventory } from '../inventory/inventoryPlacement';
import styles from '../../v5/inspector/RightInspector.module.css';
import summaryStyles from './inspectorTabPanels.module.css';

export { CacheTab, InventoryTable };

const DESCRIPTION =
  'Order-to-Cash semantic scope. Build on the graph — relationships, issues, and AI context live in the panel below.';

function statusClass(status) {
  if (status === 'Valid') return styles.statusValid;
  if (status === 'Needs resolution') return styles.statusWarning;
  return styles.statusIncomplete;
}

function validationRow(hasStarted, validationStatus) {
  if (!hasStarted) {
    return { label: 'Validation', value: 'Not started', valueClass: styles.statusIncomplete };
  }
  return {
    label: 'Validation',
    value: validationStatus,
    valueClass: statusClass(validationStatus),
  };
}

function InventorySection({ title, icon, items, selectedId, onSelect, emptyLabel }) {
  return (
    <section className={styles.inventorySection}>
      <div className={styles.inventorySectionHeader}>
        <span className={styles.inventorySectionIcon} aria-hidden>
          {icon}
        </span>
        <h3 className={styles.inventorySectionTitle}>{title}</h3>
      </div>
      <InventoryTable
        items={items}
        selectedId={selectedId}
        onSelect={onSelect}
        emptyLabel={emptyLabel}
      />
    </section>
  );
}

const SUMMARY_ITEMS = [
  { tabId: 'objects', label: 'Included Objects', countKey: 'objectCount' },
  { tabId: 'eventSources', label: 'Included Event Sources', countKey: 'eventCount' },
  { tabId: 'relationships', label: 'Included Relationships', countKey: 'relationshipCount' },
];

function InventorySummaryCounts({ objectCount, eventCount, relationshipCount, onFocusBottomTab }) {
  const counts = { objectCount, eventCount, relationshipCount };

  return (
    <div className={styles.inventorySection}>
      <h3 className={styles.inventorySectionTitle}>Included inventory</h3>
      <ul className={summaryStyles.summaryList}>
        {SUMMARY_ITEMS.map((item) => (
          <li key={item.tabId}>
            <button
              type="button"
              className={summaryStyles.summaryRowButton}
              onClick={() => onFocusBottomTab?.(item.tabId)}
            >
              <span className={styles.metaLabel}>{item.label}</span>
              <span className={styles.metaValue}>{counts[item.countKey]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OverviewTab({
  progressive,
  validationStatus,
  perspectiveName,
  objectRows,
  eventRows,
  sourceProcessId,
  processLabels,
  selectedObjectId,
  selectedEventId,
  onSelectObject,
  onSelectEvent,
  inventoryPlacement,
  relationshipCount,
  onFocusBottomTab,
}) {
  const hasStarted = progressive.hasStarted;
  const associatedProcess = sourceProcessId
    ? processLabels[sourceProcessId] ?? sourceProcessId
    : null;

  const metaRows = [
    { label: 'Asset name', value: perspectiveName || 'New Perspective' },
    {
      label: 'Status',
      value: assetMetadata.status,
      valueClass: styles.statusDot,
    },
    { label: 'Type', value: assetMetadata.type },
    { label: 'Reference Key', value: assetMetadata.referenceKey },
    validationRow(hasStarted, validationStatus),
    { label: 'Created By', value: assetMetadata.createdBy },
    { label: 'Last updated by', value: assetMetadata.lastUpdatedBy },
  ];

  if (associatedProcess) {
    metaRows.push({ label: 'Associated process', value: associatedProcess });
  }

  const agentExcerpt = agentContextMarkdown.split('\n\n')[1] ?? agentContextMarkdown;
  const showSideInventory = isSideInventory(inventoryPlacement);

  return (
    <div className={styles.tabContent}>
      <MetaRows rows={metaRows} />

      <TextBlock title="Description" empty={!hasStarted}>
        {DESCRIPTION}
      </TextBlock>

      <TextBlock title="Agent context" empty={!hasStarted}>
        {agentExcerpt}
      </TextBlock>

      {showSideInventory ? (
        <>
          <InventorySection
            title={`Included Objects (${objectRows.length})`}
            icon={<ObjectTypeIcon />}
            items={objectRows}
            selectedId={selectedObjectId}
            onSelect={onSelectObject}
            emptyLabel="None included yet"
          />

          <InventorySection
            title={`Included Event Sources (${eventRows.length})`}
            icon={
              <span className={styles.inventorySectionIconEvent}>
                <EventSourceIcon />
              </span>
            }
            items={eventRows}
            selectedId={selectedEventId}
            onSelect={onSelectEvent}
            emptyLabel="None included yet"
          />
        </>
      ) : (
        <InventorySummaryCounts
          objectCount={objectRows.length}
          eventCount={eventRows.length}
          relationshipCount={relationshipCount}
          onFocusBottomTab={onFocusBottomTab}
        />
      )}
    </div>
  );
}

export function InspectEmptyState() {
  return (
    <div className={styles.settingsEmpty}>
      <svg
        className={styles.settingsEmptyIcon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M13 13l6 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      <p className={styles.settingsEmptyText}>
        Select an element on the canvas to inspect it.
      </p>
    </div>
  );
}

export const INSPECTOR_TABS = [
  { id: 'inspect', label: 'Inspect' },
  { id: 'overview', label: 'Overview' },
  { id: 'cache', label: 'Cache' },
];
