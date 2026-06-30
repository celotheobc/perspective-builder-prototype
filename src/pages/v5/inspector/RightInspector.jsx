import { useMemo, useState } from 'react';
import {
  assetMetadata,
  eventLinks,
  eventSources,
  metricLinks,
  metrics,
  objects,
  relationships,
} from '../../../data/mockData';
import ResizeHandle from '../../v1_5/layout/ResizeHandle';
import CycleResolutionInspector from './CycleResolutionInspector';
import DisconnectedConnectionPanel from '../../../components/configuration/DisconnectedConnectionPanel';
import { SELECTION_TYPES } from '../selection/usePerspectiveSelection';
import { getRelationshipMeta } from '../../v1_5/utils/buildV2ViewData';
import {
  InspectorActions,
  InspectorButton,
  InspectorRow,
  InspectorSection,
} from '../../v1_5/inspector/inspectorParts';
import styles from '../../v1_5/inspector/inspector.module.css';
import inventoryStyles from './inventoryList.module.css';
import PanelEmptyHint from '../components/PanelEmptyHint';

const PROCESS_LABELS = {
  'order-to-cash': 'Order to Cash',
  'procure-to-pay': 'Procure to Pay',
  'accounts-payable': 'Accounts Payable',
};

function OnboardingInspector() {
  return (
    <PanelEmptyHint
      variant="perspective"
      text="Add an object or process to begin."
    />
  );
}

function statusClass(status) {
  if (status === 'Valid') return styles.statusValid;
  if (status === 'Needs resolution') return styles.statusWarning;
  return styles.statusIncomplete;
}

function InventoryList({ items, kind, selectedId, onSelect }) {
  if (!items.length) {
    return <p className={styles.muted}>None included yet</p>;
  }

  const iconClass =
    kind === 'event' ? inventoryStyles.inventoryIconEvent : inventoryStyles.inventoryIconObject;
  const iconGlyph = kind === 'event' ? '⚡' : 'O';

  return (
    <ul className={inventoryStyles.inventoryList}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={`${inventoryStyles.inventoryItem} ${
              selectedId === item.id ? inventoryStyles.inventoryItemActive : ''
            }`}
            onClick={() => onSelect(item.id)}
          >
            <span className={`${inventoryStyles.inventoryIcon} ${iconClass}`} aria-hidden>
              {iconGlyph}
            </span>
            <span className={inventoryStyles.inventoryLabel}>{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function CanvasInspector({
  progressive,
  validationStatus,
  perspectiveName,
  objectRows,
  eventRows,
  relationshipCount,
  issueCount,
  sourceProcessId,
  selection,
  onSelectObject,
  onSelectEvent,
}) {
  const [cacheOn, setCacheOn] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('12 Mar 2026, 09:42');

  const associatedProcesses = sourceProcessId
    ? [{ id: sourceProcessId, label: PROCESS_LABELS[sourceProcessId] ?? sourceProcessId }]
    : [];

  return (
    <>
      <InspectorSection>
        <InspectorRow label="Name">{perspectiveName || assetMetadata.title}</InspectorRow>
        <InspectorRow label="Status">{assetMetadata.status}</InspectorRow>
        <InspectorRow label="Validation">
          {!progressive.hasStarted ? (
            <span className={styles.statusIncomplete}>Not started</span>
          ) : (
            <span className={statusClass(validationStatus)}>{validationStatus}</span>
          )}
        </InspectorRow>
        <p className={styles.note}>
          Order-to-Cash semantic scope. Build on the graph — relationships, issues, and AI
          context live in the panel below.
        </p>
        <div className={inventoryStyles.countRow}>
          <span className={inventoryStyles.countPill}>
            {relationshipCount} Relationships
          </span>
          <span className={inventoryStyles.countPill}>{issueCount} Issues</span>
        </div>
      </InspectorSection>

      <InspectorSection title="Cache">
        <label className={styles.switchRow}>
          <span>Enable cache</span>
          <input
            type="checkbox"
            className={styles.switchInput}
            checked={cacheOn}
            onChange={(e) => setCacheOn(e.target.checked)}
            aria-label="Enable cache"
          />
          <span className={styles.switchTrack} aria-hidden />
        </label>
        <InspectorRow label="Status">
          <span className={styles.statusValid}>{cacheOn ? 'Up to date' : 'Disabled'}</span>
        </InspectorRow>
        <InspectorRow label="Last refreshed">{lastRefreshed}</InspectorRow>
        <button
          type="button"
          className={inventoryStyles.processLink}
          onClick={() => setLastRefreshed(new Date().toLocaleString())}
        >
          Refresh cache
        </button>
      </InspectorSection>

      <InspectorSection title="Included Objects">
        <InventoryList
          items={objectRows}
          kind="object"
          selectedId={selection.type === SELECTION_TYPES.OBJECT ? selection.id : null}
          onSelect={onSelectObject}
        />
      </InspectorSection>

      <InspectorSection title="Included Event Sources">
        <InventoryList
          items={eventRows}
          kind="event"
          selectedId={selection.type === SELECTION_TYPES.EVENT ? selection.id : null}
          onSelect={onSelectEvent}
        />
      </InspectorSection>

      {associatedProcesses.length > 0 && (
        <InspectorSection title="Associated Process(es)">
          <ul className={inventoryStyles.processList}>
            {associatedProcesses.map((process) => (
              <li key={process.id}>
                <span className={styles.muted}>{process.label}</span>
              </li>
            ))}
          </ul>
        </InspectorSection>
      )}
    </>
  );
}

function NavigableRelationshipList({ items, onSelect }) {
  if (!items.length) {
    return <p className={styles.muted}>No included relationships yet</p>;
  }

  return (
    <ul className={styles.relList}>
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" className={styles.relLink} onClick={() => onSelect(item.id)}>
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ObjectInspector({ id, state, progressive, onSelectRelationship }) {
  const obj = objects.find((o) => o.id === id);
  const included = progressive.includedObjects.has(id);

  const relatedRels = useMemo(
    () =>
      relationships
        .filter(
          (r) =>
            progressive.includedRelationshipIds.has(r.id) &&
            (r.source === id || r.target === id),
        )
        .map((r) => {
          const other =
            r.source === id
              ? objects.find((o) => o.id === r.target)?.name
              : objects.find((o) => o.id === r.source)?.name;
          return { id: r.id, label: `${other} · ${r.label}` };
        }),
    [id, progressive.includedRelationshipIds],
  );

  if (!obj) return <p className={styles.muted}>Object not found.</p>;

  return (
    <>
      <InspectorSection>
        <InspectorRow label="Name">{obj.name}</InspectorRow>
        <InspectorRow label="Description">
          {obj.domain} object in this perspective scope.
        </InspectorRow>
        <InspectorRow label="Domain">{obj.domain}</InspectorRow>
        <InspectorRow label="Status">
          {included ? 'Included' : state === 'ghost' ? 'Suggested' : 'Not included'}
        </InspectorRow>
        {included && (
          <p className={styles.note}>
            Show suggestions on the graph to see what you can add next from here.
          </p>
        )}
      </InspectorSection>

      <InspectorSection title="Included relationships">
        <NavigableRelationshipList
          items={relatedRels}
          onSelect={(relId) => onSelectRelationship(relId, false)}
        />
      </InspectorSection>

      <InspectorActions>
        {!included && (
          <InspectorButton onClick={() => progressive.addObject(id)}>
            Include object
          </InspectorButton>
        )}
        {included && (
          <InspectorButton variant="danger" onClick={() => progressive.removeObject(id)}>
            Remove from perspective
          </InspectorButton>
        )}
        <InspectorButton onClick={() => {}}>Open asset</InspectorButton>
      </InspectorActions>
    </>
  );
}

function EventInspector({ id, state, progressive }) {
  const event = eventSources.find((e) => e.id === id);
  const link = eventLinks.find((l) => l.eventId === id);
  const linkedObject = link
    ? objects.find((o) => o.id === link.objectId)?.name
    : '—';
  const included = progressive.includedEvents.has(id);

  if (!event) return <p className={styles.muted}>Event not found.</p>;

  return (
    <>
      <InspectorSection title="Event source">
        <InspectorRow label="Name">{event.name}</InspectorRow>
        <InspectorRow label="Description">
          Event source attached to {linkedObject} in this perspective.
        </InspectorRow>
        <InspectorRow label="Attached object">{linkedObject}</InspectorRow>
        <InspectorRow label="Source">{event.domain ?? 'Process event log'}</InspectorRow>
        <InspectorRow label="Status">
          {included ? 'Included' : state === 'ghost' ? 'Suggested' : 'Not included'}
        </InspectorRow>
      </InspectorSection>
      <InspectorActions>
        {!included && (
          <InspectorButton onClick={() => progressive.addEvent(id)}>Include event</InspectorButton>
        )}
        {included && (
          <InspectorButton variant="danger" onClick={() => progressive.removeEvent(id)}>
            Remove from perspective
          </InspectorButton>
        )}
        <InspectorButton onClick={() => {}}>Open asset</InspectorButton>
      </InspectorActions>
    </>
  );
}

function MetricInspector({ id, state, progressive }) {
  const metric = metrics.find((m) => m.id === id);
  const link = metricLinks.find((l) => l.metricId === id);
  const linkedObject = link
    ? objects.find((o) => o.id === link.objectId)?.name
    : '—';
  const included = progressive.includedMetrics.has(id);

  if (!metric) return <p className={styles.muted}>Metric not found.</p>;

  return (
    <>
      <InspectorSection title="Metric">
        <InspectorRow label="Name">{metric.name}</InspectorRow>
        <InspectorRow label="Linked object">{linkedObject}</InspectorRow>
        <InspectorRow label="Status">
          {included ? 'Included' : state === 'ghost' ? 'Suggested' : 'Not included'}
        </InspectorRow>
      </InspectorSection>
      <InspectorActions>
        {!included && (
          <InspectorButton onClick={() => progressive.addMetric(id)}>Include metric</InspectorButton>
        )}
        {included && (
          <InspectorButton variant="danger" onClick={() => progressive.removeMetric(id)}>
            Remove from perspective
          </InspectorButton>
        )}
      </InspectorActions>
    </>
  );
}

function RelationshipInspector({ id, progressive, isCycle, inCycle }) {
  const rel = relationships.find((r) => r.id === id);
  const meta = getRelationshipMeta(id);
  if (!rel) return <p className={styles.muted}>Relationship not found.</p>;

  const sourceName = objects.find((o) => o.id === rel.source)?.name ?? rel.source;
  const targetName = objects.find((o) => o.id === rel.target)?.name ?? rel.target;

  return (
    <>
      <InspectorSection title={isCycle ? 'Resolve cycle' : 'Relationship'}>
        <InspectorRow label="Name">{meta.name ?? rel.id}</InspectorRow>
        <InspectorRow label="Description">{rel.label}</InspectorRow>
        <InspectorRow label="Source">{sourceName}</InspectorRow>
        <InspectorRow label="Target">{targetName}</InspectorRow>
        <InspectorRow label="Relationship">{rel.label}</InspectorRow>
        <InspectorRow label="Cardinality">{meta.cardinality ?? '1:N'}</InspectorRow>
        {(isCycle || inCycle) && (
          <InspectorRow label="Cycle">
            <span className={styles.statusWarning}>In loop</span>
          </InspectorRow>
        )}
        {isCycle && (
          <p className={styles.note}>
            This relationship is part of a loop. Removing this single edge resolves the
            cycle.
          </p>
        )}
      </InspectorSection>
      <InspectorActions>
        {progressive.includedRelationshipIds.has(id) && (
          <InspectorButton variant="danger" onClick={() => progressive.pruneRelationship(id)}>
            Remove from perspective
          </InspectorButton>
        )}
        <InspectorButton onClick={() => {}}>Open asset</InspectorButton>
      </InspectorActions>
    </>
  );
}

const TITLES = {
  [SELECTION_TYPES.CANVAS]: 'Perspective',
  [SELECTION_TYPES.OBJECT]: 'Object',
  [SELECTION_TYPES.EVENT]: 'Event source',
  [SELECTION_TYPES.METRIC]: 'Metric',
  [SELECTION_TYPES.RELATIONSHIP]: 'Relationship',
  [SELECTION_TYPES.CYCLE_EDGE]: 'Resolve cycle',
  resolveCycle: 'Resolve cycle',
  connectObject: 'Connect object',
};

export default function RightInspector({
  selection,
  progressive,
  validationStatus,
  perspectiveName,
  objectRows,
  eventRows,
  relationshipCount,
  issueCount,
  sourceProcessId,
  collapsed,
  onToggle,
  width = 300,
  onResizeWidth,
  cycleResolution = null,
  onHighlightRelationship,
  onSelectRelationship,
  onSelectObject,
  onSelectEvent,
}) {
  const inResolutionMode = Boolean(
    cycleResolution?.active && !cycleResolution?.resolved,
  );
  const inConnectionMode = Boolean(progressive.connectionPrompt);
  const forceResolutionPanel =
    inResolutionMode && selection.type !== SELECTION_TYPES.CYCLE_EDGE;
  const forceConnectionPanel =
    inConnectionMode && !forceResolutionPanel;

  const showOnboarding =
    selection.type === SELECTION_TYPES.CANVAS && !progressive.hasStarted;

  const title = forceResolutionPanel
    ? TITLES.resolveCycle
    : forceConnectionPanel
      ? TITLES.connectObject
      : showOnboarding
        ? 'New Perspective'
        : TITLES[selection.type] ?? 'Inspector';

  const selectedRelationshipRow = cycleResolution?.rows?.find((r) => r.id === selection.id);

  return (
    <aside
      className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ''}`}
      style={{ width: collapsed ? 40 : width }}
      aria-label="Contextual inspector"
    >
      {!collapsed && onResizeWidth && (
        <ResizeHandle
          axis="x"
          onDelta={onResizeWidth}
          ariaLabel="Resize inspector width"
        />
      )}
      <div className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <button type="button" className={styles.collapseBtn} onClick={onToggle}>
            {collapsed ? '◂' : '▸'}
          </button>
        </header>
        {!collapsed && (
          <div className={styles.panelBody}>
            {forceResolutionPanel ? (
              <CycleResolutionInspector
                rows={cycleResolution.rows}
                alert={cycleResolution.alert}
                highlightedRelationshipId={cycleResolution.highlightedRelationshipId}
                onHighlightRelationship={onHighlightRelationship}
                onSelectRelationship={onSelectRelationship}
                onRemoveRelationship={progressive.pruneRelationship}
              />
            ) : forceConnectionPanel ? (
              <DisconnectedConnectionPanel
                prompt={progressive.connectionPrompt}
                includedObjects={progressive.includedObjects}
                previewPathId={progressive.previewBridgePathId}
                onPreviewPath={progressive.previewConnectionPath}
                onClearPreview={progressive.clearConnectionPathPreview}
                onInsertPath={progressive.insertConnectionPath}
                onKeepUnconnected={progressive.keepObjectsUnconnected}
              />
            ) : (
              <>
                {selection.type === SELECTION_TYPES.CANVAS &&
                  (showOnboarding ? (
                    <OnboardingInspector />
                  ) : (
                    <CanvasInspector
                      progressive={progressive}
                      validationStatus={validationStatus}
                      perspectiveName={perspectiveName}
                      objectRows={objectRows}
                      eventRows={eventRows}
                      relationshipCount={relationshipCount}
                      issueCount={issueCount}
                      sourceProcessId={sourceProcessId}
                      selection={selection}
                      onSelectObject={onSelectObject}
                      onSelectEvent={onSelectEvent}
                    />
                  ))}
                {selection.type === SELECTION_TYPES.OBJECT && (
                  <ObjectInspector
                    id={selection.id}
                    state={selection.state}
                    progressive={progressive}
                    onSelectRelationship={onSelectRelationship}
                  />
                )}
                {selection.type === SELECTION_TYPES.EVENT && (
                  <EventInspector
                    id={selection.id}
                    state={selection.state}
                    progressive={progressive}
                  />
                )}
                {selection.type === SELECTION_TYPES.METRIC && (
                  <MetricInspector
                    id={selection.id}
                    state={selection.state}
                    progressive={progressive}
                  />
                )}
                {selection.type === SELECTION_TYPES.RELATIONSHIP && (
                  <RelationshipInspector
                    id={selection.id}
                    progressive={progressive}
                    isCycle={false}
                    inCycle={selectedRelationshipRow?.isConflicting}
                  />
                )}
                {selection.type === SELECTION_TYPES.CYCLE_EDGE && (
                  <RelationshipInspector
                    id={selection.id}
                    progressive={progressive}
                    isCycle
                    inCycle
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
