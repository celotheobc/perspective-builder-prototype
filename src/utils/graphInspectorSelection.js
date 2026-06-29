import { NODE_KINDS } from '../data/mockData';

export function getInspectorNodeSelected(nodeId, kind, selection) {
  if (!selection) return false;
  if (selection.type === 'object' && kind === NODE_KINDS.OBJECT && selection.id === nodeId) {
    return true;
  }
  if (selection.type === 'event' && kind === NODE_KINDS.EVENT_SOURCE) {
    return selection.id === nodeId.replace(/^event-/, '');
  }
  if (selection.type === 'metric' && kind === NODE_KINDS.METRIC) {
    return selection.id === nodeId.replace(/^metric-/, '');
  }
  return false;
}

export function inspectorNodeDataFlags(nodeId, kind, ctx) {
  return {
    isInspectorSelected: getInspectorNodeSelected(
      nodeId,
      kind,
      ctx.inspectorSelection,
    ),
    inspectorSelectionMode: Boolean(ctx.enableInspectorSelection),
  };
}

export function getInspectorEdgeSelected(relId, selection) {
  if (!selection || !relId) return false;
  return (
    (selection.type === 'relationship' || selection.type === 'cycleEdge') &&
    selection.id === relId
  );
}
