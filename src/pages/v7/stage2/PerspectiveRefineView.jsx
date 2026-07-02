import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildRelationshipTableView } from '../../../utils/perspectiveRelationships';
import {
  buildPerspectiveEventSourceRows,
  buildPerspectiveObjectRows,
} from '../../../utils/perspectiveEntities';
import Toast from '../../../components/ui/Toast';
import { useProgressiveBuilder } from '../../../hooks/useProgressiveBuilder';
import { useGraphBuilderContext } from '../../../hooks/useGraphBuilderContext';
import { EXPERIENCES } from '../../../data/mockData';
import AssetEditorLayout from '../../v2/layout/AssetEditorLayout';
import { usePanelDimensionsV5 } from '../../v5/layout/usePanelDimensionsV5';
import RightInspector from '../inspector/RightInspector';
import BottomPanelV7 from '../panels/BottomPanelV7';
import { usePerspectiveSelection } from '../../v5/selection/usePerspectiveSelection';
import { buildV2Issues } from '../../v1_5/utils/buildV2ViewData';
import EmptyStateV5 from '../../v5/components/EmptyStateV5';
import { getProcessSeed } from '../../v4/data/processPageData';
import { useClearEntitySelectionOnCycle } from '../../../hooks/useClearEntitySelectionOnCycle';
import { INVENTORY_PLACEMENT } from '../../v6/inventory/inventoryPlacement';
import { useInventoryPlacement } from '../../v6/inventory/InventoryPlacementContext';
import { getCycleImpactPreview } from '../data/cycleImpactPreviews';
import layoutStyles from '../../v1_5/PerspectiveBuilderV1_5.module.css';

export default function PerspectiveRefineView({
  perspectiveName,
  initialObjects = [],
  initialEvents = [],
  initialSourceProcessId = null,
}) {
  const progressive = useProgressiveBuilder('global', {
    unfocusedShowsAllGhosts: true,
    autoSuppressSuggestionsOnResolution: true,
    initialIncludedObjects: initialObjects,
    initialIncludedEvents: initialEvents,
  });

  const [sourceProcessId, setSourceProcessId] = useState(initialSourceProcessId);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('overview');
  const [previewRelationshipId, setPreviewRelationshipId] = useState(null);
  const [resolvedDecisions, setResolvedDecisions] = useState([]);
  const { placement: inventoryPlacement } = useInventoryPlacement();

  const { rightWidth, bottomHeight, adjustRightWidth, adjustBottomHeight } =
    usePanelDimensionsV5();

  const {
    selection,
    highlightedRelationshipId,
    bottomTab,
    setBottomTab,
    setHighlightedRelationshipId,
    selectObject,
    selectEvent,
    selectRelationship,
    selectIssue,
    selectCanvas,
    graphSelection: baseGraphSelection,
  } = usePerspectiveSelection();

  useEffect(() => {
    if (
      inventoryPlacement === INVENTORY_PLACEMENT.SIDE &&
      (bottomTab === 'objects' || bottomTab === 'eventSources')
    ) {
      setBottomTab('relationships');
    }
  }, [inventoryPlacement, bottomTab, setBottomTab]);

  const focusIncludedObject = useCallback(
    (id) => {
      if (progressive.includedObjects.has(id)) {
        progressive.focusExpansionFrom(id, { silent: true });
      }
    },
    [progressive.includedObjects, progressive.focusExpansionFrom],
  );

  const selectCanvasWithClearFocus = useCallback(() => {
    selectCanvas();
    progressive.clearExpansionFocus();
    setRightPanelTab('overview');
  }, [selectCanvas, progressive.clearExpansionFocus]);

  const graphSelection = useMemo(
    () => ({
      ...baseGraphSelection,
      onSelectCanvas: selectCanvasWithClearFocus,
      onSelectNode: ({ kind, id, state }) => {
        baseGraphSelection.onSelectNode({ kind, id, state });
        setRightPanelTab('inspect');
        if (kind === 'object') focusIncludedObject(id);
      },
      onSelectEdge: ({ id, isCycleEdge }) => {
        baseGraphSelection.onSelectEdge({ id, isCycleEdge });
        setRightPanelTab('inspect');
      },
    }),
    [baseGraphSelection, focusIncludedObject, selectCanvasWithClearFocus],
  );

  const handleSelectObject = useCallback(
    (id) => {
      selectObject(id);
      focusIncludedObject(id);
      setRightPanelTab('inspect');
      setRightCollapsed(false);
    },
    [selectObject, focusIncludedObject],
  );

  const handleSelectEvent = useCallback(
    (id) => {
      selectEvent(id);
      setRightPanelTab('inspect');
      setRightCollapsed(false);
    },
    [selectEvent],
  );

  const handleSelectRelationship = useCallback(
    (id, isCycleEdge = false) => {
      selectRelationship(id, isCycleEdge);
      setRightPanelTab('inspect');
      setRightCollapsed(false);
      setBottomCollapsed(false);
    },
    [selectRelationship],
  );

  const handleSelectIssue = useCallback(() => {
    selectIssue();
    setBottomCollapsed(false);
  }, [selectIssue]);

  const handleFocusBottomTab = useCallback(
    (tabId) => {
      setBottomTab(tabId);
      setBottomCollapsed(false);
    },
    [setBottomTab],
  );

  const handleStartFromProcess = useCallback(
    (processId) => {
      const seed = getProcessSeed(processId);
      progressive.seedFromAssets(seed.objects, seed.events);
      setSourceProcessId(processId);
      selectCanvasWithClearFocus();
    },
    [progressive, selectCanvasWithClearFocus],
  );

  const relationshipTable = useMemo(
    () =>
      buildRelationshipTableView(
        progressive.activeRelationships,
        progressive.includedObjects,
        {
          active: progressive.cycleActive,
          resolved: progressive.isCycleResolved,
          edgeIds: progressive.cycleEdgeIds,
        },
      ),
    [progressive],
  );

  const handlePreviewImpact = useCallback(
    (relId) => {
      setPreviewRelationshipId(relId);
      setHighlightedRelationshipId(relId);
      setBottomTab('consequences');
      setBottomCollapsed(false);
    },
    [setBottomTab, setHighlightedRelationshipId],
  );

  const handleRemoveRelationship = useCallback(
    (relId) => {
      const row = relationshipTable.rows.find((r) => r.id === relId);
      setResolvedDecisions((prev) => [
        ...prev.filter((d) => d.id !== relId),
        {
          id: relId,
          label: row?.name ?? relId,
          reviewedAt: new Date().toISOString(),
        },
      ]);
      setPreviewRelationshipId(null);
      progressive.pruneRelationship(relId);
    },
    [progressive, relationshipTable.rows],
  );

  const handleReviewResolvedDecision = useCallback(
    (relId) => {
      setPreviewRelationshipId(relId);
      setHighlightedRelationshipId(relId);
      setBottomTab('consequences');
      setBottomCollapsed(false);
    },
    [setBottomTab, setHighlightedRelationshipId],
  );

  const impactPreview = useMemo(() => {
    if (!previewRelationshipId) return null;
    const row = relationshipTable.rows.find((r) => r.id === previewRelationshipId);
    return getCycleImpactPreview(previewRelationshipId, row?.name);
  }, [previewRelationshipId, relationshipTable.rows]);

  const cycleActive = progressive.cycleActive && !progressive.isCycleResolved;
  const effectiveGraphHighlight =
    cycleActive && previewRelationshipId
      ? (highlightedRelationshipId ?? previewRelationshipId)
      : highlightedRelationshipId;
  const hadConnectionPrompt = useRef(false);

  useClearEntitySelectionOnCycle({
    cycleActive,
    selectionType: selection.type,
    onClear: selectCanvasWithClearFocus,
    onCycleEnter: () => {
      setRightCollapsed(false);
      setBottomCollapsed(false);
    },
  });

  useEffect(() => {
    if (progressive.connectionPrompt && !hadConnectionPrompt.current) {
      selectCanvasWithClearFocus();
      setRightCollapsed(false);
    }
    hadConnectionPrompt.current = Boolean(progressive.connectionPrompt);
  }, [progressive.connectionPrompt, selectCanvasWithClearFocus]);

  useEffect(() => {
    if (!cycleActive) return;
    setPreviewRelationshipId(null);
  }, [cycleActive]);

  const { validationStatus } = useGraphBuilderContext({
    experience: EXPERIENCES.PROGRESSIVE,
    progressive,
    routeAmbiguity: { includedObjects: new Set(), activeRelationships: [] },
    highlightedRelationshipId: effectiveGraphHighlight,
    inspectorSelection: selection,
  });

  const objectRows = useMemo(
    () => buildPerspectiveObjectRows(progressive.includedObjects),
    [progressive.includedObjects],
  );

  const eventRows = useMemo(
    () => buildPerspectiveEventSourceRows(progressive.includedEvents),
    [progressive.includedEvents],
  );

  const issues = useMemo(
    () => buildV2Issues(progressive).filter((issue) => issue.id !== 'cycle-multiple-paths'),
    [progressive],
  );

  const tabCounts = {
    objects: objectRows.length,
    eventSources: eventRows.length,
    relationships: relationshipTable.rows.length,
    issues: issues.length,
  };

  const cycleResolution = {
    active: progressive.cycleActive,
    resolved: progressive.isCycleResolved,
    rows: relationshipTable.rows,
    alert: relationshipTable.alert,
    highlightedRelationshipId: effectiveGraphHighlight,
  };

  return (
    <>
      <div className={layoutStyles.page}>
        <AssetEditorLayout
          progressive={progressive}
          graphSelection={graphSelection}
          highlightedRelationshipId={effectiveGraphHighlight}
          hideMetrics
          combinedCanvasToolbar
          showProcessFilter
          emptyStateComponent={EmptyStateV5}
          emptyStateProps={{
            onStartFromProcess: handleStartFromProcess,
          }}
          rightInspector={
            <RightInspector
              selection={selection}
              progressive={progressive}
              validationStatus={validationStatus}
              perspectiveName={perspectiveName}
              objectRows={objectRows}
              eventRows={eventRows}
              sourceProcessId={sourceProcessId}
              collapsed={rightCollapsed}
              onToggle={() => setRightCollapsed((v) => !v)}
              width={rightWidth}
              onResizeWidth={adjustRightWidth}
              cycleResolution={cycleResolution}
              previewRelationshipId={previewRelationshipId}
              onPreviewImpact={handlePreviewImpact}
              onRemoveRelationship={handleRemoveRelationship}
              onHighlightRelationship={setHighlightedRelationshipId}
              onSelectRelationship={handleSelectRelationship}
              onSelectObject={handleSelectObject}
              onSelectEvent={handleSelectEvent}
              activeTab={rightPanelTab}
              onActiveTabChange={setRightPanelTab}
              inventoryPlacement={inventoryPlacement}
              relationshipCount={relationshipTable.rows.length}
              onFocusBottomTab={handleFocusBottomTab}
            />
          }
          bottomPanel={
            <BottomPanelV7
              activeTab={bottomTab}
              onTabChange={setBottomTab}
              collapsed={bottomCollapsed}
              onToggle={() => setBottomCollapsed((v) => !v)}
              height={bottomHeight}
              onResizeHeight={adjustBottomHeight}
              tabCounts={tabCounts}
              relationshipRows={relationshipTable.rows}
              objectRows={objectRows}
              eventRows={eventRows}
              issues={issues}
              resolvedDecisions={resolvedDecisions}
              impactPreview={impactPreview}
              onReviewResolvedDecision={handleReviewResolvedDecision}
              selection={selection}
              onSelectRelationship={handleSelectRelationship}
              onSelectIssue={handleSelectIssue}
              onSelectObject={handleSelectObject}
              onSelectEvent={handleSelectEvent}
              onHoverRelationship={setHighlightedRelationshipId}
              highlightedRelationshipId={effectiveGraphHighlight}
              perspectiveEmpty={!progressive.hasStarted}
              inventoryPlacement={inventoryPlacement}
            />
          }
        />
      </div>
      <Toast toast={progressive.toast} />
    </>
  );
}
