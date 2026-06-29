export const TOUR_ROUTES = {
  SCRATCH: 'scratch',
  CONTEXT: 'context',
};

export const SCRATCH_STEPS = [
  {
    id: 'intro',
    text: 'This is the Context Model graph. From here there are two ways to create a new Perspective: from scratch, or by choosing existing assets from the Context Model.',
  },
  {
    id: 'create-perspective',
    text: 'From scratch: locate Perspectives in the navigation tree and click the small + icon to create an empty perspective.',
  },
  {
    id: 'tab-opened',
    text: 'A new tab opens with your empty perspective.',
  },
  {
    id: 'seed-sales-order',
    text: 'Choose a seed object — add Sales Order by clicking the suggested chip (or search for it).',
  },
  {
    id: 'ghosts-explained',
    text: 'Sales Order has been added. Ghost nodes on the canvas suggest additions to this perspective.',
  },
  {
    id: 'inspector-contextual',
    text: 'The right panel is contextual — it shows information about your selection. Click Sales Order on the graph or in the table below.',
  },
  {
    id: 'canvas-focus',
    text: 'Click the main canvas again to unselect and focus back on the perspective.',
  },
  {
    id: 'add-customer',
    text: 'Add Customer by clicking the ghost + on the canvas.',
  },
  {
    id: 'add-delivery-item',
    text: 'Now add Delivery Item.',
  },
  {
    id: 'add-delivery',
    text: 'Now add Delivery — this creates a cycle that must be fixed.',
  },
  {
    id: 'resolve-cycle',
    text: 'Choose which relationship to remove to resolve the cycle. Hover options in the right panel to preview the change, then remove one.',
  },
  {
    id: 'add-disconnected',
    text: 'Back in suggestion mode. Click + Add to list all available object types, then choose Accounts Hub.',
  },
  {
    id: 'vendor-hub-path',
    text: 'Choose any connection path for Accounts Hub. If your choice creates a cycle, resolve it as before.',
  },
  {
    id: 'event-discovery',
    text: 'In Show suggestions, uncheck Objects and check Event Sources.',
  },
  {
    id: 'add-events',
    text: 'Add any event sources you wish.',
  },
  {
    id: 'inventory-tabs',
    text: 'Open the Included Objects tab under the graph. Click an object name to highlight it on the graph. Try Events and Relationships too.',
  },
  {
    id: 'finish',
    text: "You're done exploring the from-scratch flow.",
  },
];

export const CONTEXT_STEPS = [
  {
    id: 'cm-intro',
    text: 'Sometimes it is easier to create a perspective after browsing what is available in the Context Model. This route is built around that.',
  },
  {
    id: 'cm-select-assets',
    text: 'Click Select assets at the bottom left of the graph. A selection toolbar opens.',
  },
  {
    id: 'cm-choose-assets',
    text: 'Choose any combination of objects and events to add to your perspective.',
  },
  {
    id: 'cm-add-to-perspective',
    text: 'When ready, click Add to perspective in the toolbar.',
  },
  {
    id: 'cm-new-perspective',
    text: 'Add to a new perspective (or an existing one). Choose New perspective.',
  },
  {
    id: 'cm-tab-opened',
    text: 'A new perspective asset opens in a new tab. Continue refining it as in the from-scratch flow.',
  },
  {
    id: 'cm-finish',
    text: "You're done exploring the Context Model selection flow.",
  },
];
