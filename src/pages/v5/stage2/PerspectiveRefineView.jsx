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
import { usePanelDimensions } from '../../v1_5/layout/usePanelDimensions';
import RightInspector from '../inspector/RightInspector';
import BottomPanelV5 from '../panels/BottomPanelV5';
import { usePerspectiveSelection } from '../selection/usePerspectiveSelection';
import { buildV2Issues } from '../../v1_5/utils/buildV2ViewData';
import EmptyStateV5 from '../components/EmptyStateV5';
import { getProcessSeed } from '../../v4/data/processPageData';
import { useClearEntitySelectionOnCycle } from '../../../hooks/useClearEntitySelectionOnCycle';
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
  const { rightWidth, bottomHeight, adjustRightWidth, adjustBottomHeight } =
    usePanelDimensions();

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
  }, [selectCanvas, progressive.clearExpansionFocus]);

  const graphSelection = useMemo(
    () => ({
      ...baseGraphSelection,
      onSelectCanvas: selectCanvasWithClearFocus,
      onSelectNode: ({ kind, id, state }) => {
        baseGraphSelection.onSelectNode({ kind, id, state });
        if (kind === 'object') focusIncludedObject(id);
      },
    }),
    [baseGraphSelection, focusIncludedObject, selectCanvasWithClearFocus],
  );

  const handleSelectObject = useCallback(
    (id) => {
      selectObject(id);
      focusIncludedObject(id);
      setRightCollapsed(false);
    },
    [selectObject, focusIncludedObject],
  );

  const handleSelectEvent = useCallback(
    (id) => {
      selectEvent(id);
      setRightCollapsed(false);
    },
    [selectEvent],
  );

  const handleSelectRelationship = useCallback(
    (id, isCycleEdge = false) => {
      selectRelationship(id, isCycleEdge);
      setRightCollapsed(false);
      setBottomCollapsed(false);
    },
    [selectRelationship],
  );

  const handleSelectIssue = useCallback(() => {
    selectIssue();
    setBottomCollapsed(false);
  }, [selectIssue]);

  const handleStartFromProcess = useCallback(
    (processId) => {
      const seed = getProcessSeed(processId);
      progressive.seedFromAssets(seed.objects, seed.events);
      setSourceProcessId(processId);
      selectCanvasWithClearFocus();
    },
    [progressive, selectCanvasWithClearFocus],
  );

  const cycleActive = progressive.cycleActive && !progressive.isCycleResolved;
  const hadConnectionPrompt = useRef(false);

  useClearEntitySelectionOnCycle({
    cycleActive,
    selectionType: selection.type,
    onClear: selectCanvasWithClearFocus,
    onCycleEnter: () => {
      setRightCollapsed(false);
      setBottomCollapsed(false);
      setBottomTab('issues');
    },
  });

  useEffect(() => {
    if (progressive.connectionPrompt && !hadConnectionPrompt.current) {
      selectCanvasWithClearFocus();
      setRightCollapsed(false);
    }
    hadConnectionPrompt.current = Boolean(progressive.connectionPrompt);
  }, [progressive.connectionPrompt, selectCanvasWithClearFocus]);

  const { validationStatus } = useGraphBuilderContext({
    experience: EXPERIENCES.PROGRESSIVE,
    progressive,
    routeAmbiguity: { includedObjects: new Set(), activeRelationships: [] },
    highlightedRelationshipId,
    inspectorSelection: selection,
  });

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

  const objectRows = useMemo(
    () => buildPerspectiveObjectRows(progressive.includedObjects),
    [progressive.includedObjects],
  );

  const eventRows = useMemo(
    () => buildPerspectiveEventSourceRows(progressive.includedEvents),
    [progressive.includedEvents],
  );

  const issues = useMemo(() => buildV2Issues(progressive), [progressive]);

  const tabCounts = {
    relationships: relationshipTable.rows.length,
    issues: issues.length,
  };

  const cycleResolution = {
    active: progressive.cycleActive,
    resolved: progressive.isCycleResolved,
    rows: relationshipTable.rows,
    alert: relationshipTable.alert,
    highlightedRelationshipId,
  };

  return (
    <>
      <div className={layoutStyles.page}>
        <AssetEditorLayout
          progressive={progressive}
          graphSelection={graphSelection}
          highlightedRelationshipId={highlightedRelationshipId}
          hideMetrics
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
              relationshipCount={relationshipTable.rows.length}
              issueCount={issues.length}
              sourceProcessId={sourceProcessId}
              collapsed={rightCollapsed}
              onToggle={() => setRightCollapsed((v) => !v)}
              width={rightWidth}
              onResizeWidth={adjustRightWidth}
              cycleResolution={cycleResolution}
              onHighlightRelationship={setHighlightedRelationshipId}
              onSelectRelationship={handleSelectRelationship}
              onSelectObject={handleSelectObject}
              onSelectEvent={handleSelectEvent}
            />
          }
          bottomPanel={
            <BottomPanelV5
              activeTab={bottomTab}
              onTabChange={setBottomTab}
              collapsed={bottomCollapsed}
              onToggle={() => setBottomCollapsed((v) => !v)}
              height={bottomHeight}
              onResizeHeight={adjustBottomHeight}
              tabCounts={tabCounts}
              relationshipRows={relationshipTable.rows}
              issues={issues}
              selection={selection}
              onSelectRelationship={handleSelectRelationship}
              onSelectIssue={handleSelectIssue}
              onHoverRelationship={setHighlightedRelationshipId}
              perspectiveEmpty={!progressive.hasStarted}
            />
          }
        />
      </div>
      <Toast toast={progressive.toast} />
    </>
  );
}
