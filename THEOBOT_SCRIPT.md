# TheoBot — Tour Guide Script & Behaviour

> Offline reference for editing copy and flow.  
> **Live copy:** `src/components/demoTour/demoTourSteps.js`  
> **Completion logic:** `src/components/demoTour/useDemoTourProgress.js`

---

## What TheoBot is

**TheoBot** is an in-prototype **tour guide** for **v3** of the Perspective Builder. It is not a chatbot — it is a **persistent checklist companion** that:

- Lives as your avatar in the **bottom-left Studio nav** (replacing the old “BC” profile chip)
- Opens a **checklist panel** beside the nav when clicked
- Tracks **two demo routes**: **From scratch** and **Context Model**
- **Auto-checks steps** as the user performs real actions in the UI (no manual “next” buttons)
- Shows **progress %** inside the open panel

Its job is to help someone **share or self-navigate the prototype** — especially the Order-to-Cash progressive build — without live narration. It teaches:

1. How to create a Perspective (two entry paths)
2. How the **graph-first** editing model works (ghost nodes, cycles, disconnected inserts)
3. How the **contextual inspector** behaves (selection-driven right panel)
4. How the **bottom inventory** links graph ↔ tables

Tone-wise it should feel like a friendly guide walking a stakeholder through a demo, not product documentation.

---

## How it works (mechanics)

| Element | Behaviour |
|--------|-----------|
| **Trigger** | Click TheoBot avatar in L0 nav (bottom left) |
| **Panel** | Opens anchored bottom-left; closes with × |
| **Routes** | Tabs: **From scratch** · **Context Model** — independent checklists |
| **Steps** | Ordered list; current step highlighted; completed steps show ✓ |
| **Progress** | `%` badge + bar in panel header |
| **Completion** | Steps tick automatically when app state matches; final step auto-completes when all prior steps are done |
| **Scope** | v3 only (`PerspectiveBuilderV3`) |
| **Copy source** | `src/components/demoTour/demoTourSteps.js` |

**Important for copy editing:** Steps are **sequential in display** but **not gated** — users can do things out of order and multiple steps may check off at once if state catches up.

---

## UI chrome (fixed strings)

| Location | Copy |
|----------|------|
| Panel eyebrow | Tour guide |
| Panel title | TheoBot |
| Route tabs | From scratch · Context Model |
| Footer hint | TheoBot checks off steps as you complete actions in the prototype. |
| All-done button | Mark route complete |
| Avatar aria | TheoBot tour guide |

---

## Route A — From scratch (17 steps)

*Canonical O2C build: Sales Order → quartet → cycle → Accounts Hub → events → inventory exploration*

| # | Step ID | Current copy | Auto-checks when… |
|---|---------|--------------|-------------------|
| 1 | `intro` | This is the Context Model graph. From here there are two ways to create a new Perspective: from scratch, or by choosing existing assets from the Context Model. | User is on Browse Context Model tab **or** any refine tab |
| 2 | `create-perspective` | From scratch: locate Perspectives in the navigation tree and click the small + icon to create an empty perspective. | User clicked **+** next to Perspectives in L1 nav |
| 3 | `tab-opened` | A new tab opens with your empty perspective. | Active tab is refine + canvas has no objects yet |
| 4 | `seed-sales-order` | Choose a seed object — add Sales Order by clicking the suggested chip (or search for it). | `sales-order` in included objects |
| 5 | `ghosts-explained` | Sales Order has been added. Ghost nodes on the canvas suggest additions to this perspective. | `sales-order` in included objects *(same trigger as 4 — both tick together)* |
| 6 | `inspector-contextual` | The right panel is contextual — it shows information about your selection. Click Sales Order on the graph or in the table below. | User selects any object in inspector (graph or table) |
| 7 | `canvas-focus` | Click the main canvas again to unselect and focus back on the perspective. | User selects canvas **after** having selected an object |
| 8 | `add-customer` | Add Customer by clicking the ghost + on the canvas. | `customer` included |
| 9 | `add-delivery-item` | Now add Delivery Item. | `delivery-item` included |
| 10 | `add-delivery` | Now add Delivery — this creates a cycle that must be fixed. | `delivery` included |
| 11 | `resolve-cycle` | Choose which relationship to remove to resolve the cycle. Hover options in the right panel to preview the change, then remove one. | User prunes a relationship and cycle is resolved |
| 12 | `add-disconnected` | Back in suggestion mode. Click + Add to list all available object types, then choose Accounts Hub. | Connection prompt appears, or Accounts Hub (`vendor-hub`) added |
| 13 | `vendor-hub-path` | Choose any connection path for Accounts Hub. If your choice creates a cycle, resolve it as before. | `vendor-hub` included |
| 14 | `event-discovery` | In Show suggestions, uncheck Objects and check Event Sources. | Suggestions panel: Events on, Objects off |
| 15 | `add-events` | Add any event sources you wish. | At least one event included |
| 16 | `inventory-tabs` | Open the Included Objects tab under the graph. Click an object name to highlight it on the graph. Try Events and Relationships too. | User switches to Relationships or Events bottom tab |
| 17 | `finish` | You're done exploring the from-scratch flow. | All steps 1–16 complete |

### Narrative arc

1. **Orient** — CM graph, two creation paths
2. **Create empty asset** — L1 + → new tab
3. **Seed** — Sales Order chip
4. **Learn ghosts** — suggested neighbours on canvas
5. **Learn inspector** — object focus → canvas focus
6. **Build quartet** — Customer → Delivery Item → Delivery
7. **Resolve cycle** — right panel / hover preview
8. **Disconnected insert** — + Add → Accounts Hub → pick path
9. **Expand discovery** — events via suggestions panel
10. **Cross-link UI** — bottom inventory tabs highlight graph

---

## Route B — Context Model (7 steps)

*Basket selection on CM graph → new perspective tab → then same refine experience*

| # | Step ID | Current copy | Auto-checks when… |
|---|---------|--------------|-------------------|
| 1 | `cm-intro` | Sometimes it is easier to create a perspective after browsing what is available in the Context Model. This route is built around that. | On Browse Context Model tab |
| 2 | `cm-select-assets` | Click Select assets at the bottom left of the graph. A selection toolbar opens. | Selection mode entered |
| 3 | `cm-choose-assets` | Choose any combination of objects and events to add to your perspective. | At least one object or event in basket |
| 4 | `cm-add-to-perspective` | When ready, click Add to perspective in the toolbar. | User clicks Add to new perspective |
| 5 | `cm-new-perspective` | Add to a new perspective (or an existing one). Choose New perspective. | Same event as step 4 |
| 6 | `cm-tab-opened` | A new perspective asset opens in a new tab. Continue refining it as in the from-scratch flow. | New refine tab open with basket contents |
| 7 | `cm-finish` | You're done exploring the Context Model selection flow. | All steps 1–6 complete |

### Narrative arc

1. **Why this route** — browse-first creation
2. **Enter selection** — Select assets FAB
3. **Build basket** — click nodes (+/− on pucks)
4. **Commit** — Add to perspective → New perspective
5. **Hand off** — refine tab opens; user continues Route A from step 4 onward (not explicitly guided after step 6)

---

## Demo data the script assumes

From `src/data/demoScenario.js`:

| Concept | Value |
|---------|-------|
| Start object | Sales Order |
| Ghost quartet | Customer, Delivery, Delivery Item (with Sales Order → cycle) |
| Disconnected insert | Accounts Hub (`vendor-hub`) via + Add |
| Cycle | Four relationships forming a delivery loop |

---

## Known copy / flow quirks

1. **Steps 4 & 5** (scratch) complete on the same action — consider merging or differentiating copy.
2. **Steps 4 & 5** (context) also overlap — “Add to perspective” and “New perspective” fire together.
3. **Route B ends abruptly** — step 6 says “continue as from-scratch” but doesn’t link into Route A steps.
4. **Step 16** only detects Relationships/Events tabs, not Objects tab clicks.
5. **Intro step** completes immediately on v3 load (user is already on CM graph).
6. TheoBot is **v3-only** — not on cover page or v1/v2.

---

## Suggested voice for TheoBot

- First person plural or direct address: *“Let’s…”*, *“Try clicking…”*
- Short, imperative, one action per step
- Name UI elements exactly as they appear: **Select assets**, **+ Add**, **Show suggestions**
- Call out *why* at key moments (cycle, contextual inspector, disconnected object) — not every step

---

## Code map

| What | File |
|------|------|
| Step copy | `src/components/demoTour/demoTourSteps.js` |
| Completion logic | `src/components/demoTour/useDemoTourProgress.js` |
| Panel UI | `src/components/demoTour/DemoTourPopover.jsx` |
| Context / state | `src/components/demoTour/DemoTourContext.jsx` |
| v3 integration | `src/pages/v3/PerspectiveBuilderV3.jsx` |
| Refine state reporting | `src/pages/v3/stage2/PerspectiveRefineView.jsx` |
| L0 nav trigger | `src/pages/v3/shell/StudioL0Nav.jsx` |
| Demo object names / flow | `src/data/demoScenario.js` |
| Avatar asset | `src/assets/theobot-avatar.png` |
