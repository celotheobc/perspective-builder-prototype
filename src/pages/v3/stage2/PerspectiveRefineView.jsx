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
import RightInspector from '../../v2/inspector/RightInspector';
import BottomPanelV3 from '../panels/BottomPanelV3';
import { usePerspectiveSelection } from '../../v1_5/selection/usePerspectiveSelection';
import { buildV2Issues } from '../../v1_5/utils/buildV2ViewData';
import layoutStyles from '../../v1_5/PerspectiveBuilderV1_5.module.css';

export default function PerspectiveRefineView({
  perspectiveName,
  initialObjects = [],
  initialEvents = [],
}) {
  const progressive = useProgressiveBuilder('global', {
    unfocusedShowsAllGhosts: true,
    autoSuppressSuggestionsOnResolution: true,
    initialIncludedObjects: initialObjects,
    initialIncludedEvents: initialEvents,
  });

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
    [progressive],
  );

  const selectCanvasWithClearFocus = useCallback(() => {
    selectCanvas();
    progressive.clearExpansionFocus();
  }, [selectCanvas, progressive]);

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
    },
    [selectObject, focusIncludedObject],
  );

  const cycleActive = progressive.cycleActive && !progressive.isCycleResolved;
  const wasCycleActive = useRef(false);
  const hadConnectionPrompt = useRef(false);

  useEffect(() => {
    if (cycleActive && !wasCycleActive.current) {
      selectCanvasWithClearFocus();
      setRightCollapsed(false);
    }
    wasCycleActive.current = cycleActive;
  }, [cycleActive, selectCanvasWithClearFocus]);

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

  const objectRows = useMemo(() => {
    const rows = buildPerspectiveObjectRows(progressive.includedObjects);
    return rows.map((row) => ({
      ...row,
      inPerspectiveRelationships: progressive.activeRelationships.filter(
        (r) =>
          progressive.includedRelationshipIds.has(r.id) &&
          (r.source === row.id || r.target === row.id),
      ).length,
    }));
  }, [
    progressive.includedObjects,
    progressive.activeRelationships,
    progressive.includedRelationshipIds,
  ]);

  const eventRows = useMemo(
    () => buildPerspectiveEventSourceRows(progressive.includedEvents),
    [progressive.includedEvents],
  );

  const issues = useMemo(() => buildV2Issues(progressive), [progressive]);

  const tabCounts = {
    objects: objectRows.length,
    relationships: relationshipTable.rows.length,
    events: eventRows.length,
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
            rightInspector={
              <RightInspector
                selection={selection}
                progressive={progressive}
                validationStatus={validationStatus}
                collapsed={rightCollapsed}
                onToggle={() => setRightCollapsed((v) => !v)}
                width={rightWidth}
                onResizeWidth={adjustRightWidth}
                cycleResolution={cycleResolution}
                onHighlightRelationship={setHighlightedRelationshipId}
                onSelectRelationship={selectRelationship}
              />
            }
            bottomPanel={
              <BottomPanelV3
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
                selection={selection}
                onSelectRelationship={selectRelationship}
                onSelectObject={handleSelectObject}
                onSelectEvent={selectEvent}
                onSelectIssue={selectIssue}
              />
            }
          />
        </div>
      <Toast toast={progressive.toast} />
    </>
  );
}
