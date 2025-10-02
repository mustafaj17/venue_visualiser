## Dashboard (Visual-Only) Implementation

This document describes the initial, visual-only dashboard UI, the Server vs Client component split, and the fix for a build error encountered when using `next/dynamic` with `ssr: false` inside a Server Component.

### Goals

- Provide a clean dashboard layout that matches the reference style (header + actions + card grid)
- Keep it visual-only for now (no persistence); a modal opens from the Add Item action
- Structure the code so future CRUD with TanStack Query can plug in cleanly

### What was added/changed

#### New components

- `components/dashboard/item-card.tsx`

  - Visual card with placeholder thumbnail area
  - Supports props: `title`, `subtitle?`, `sku?`, `tagLabel?`, `tagColorClass?`
  - Shows a pill-style tag (e.g., Chairs/Tables/Centerpieces) and Edit/Delete buttons (non-functional)

- `components/dashboard/create-item-modal.tsx`

  - Simple visual modal with placeholder inputs and image-upload placeholder area
  - No persistence yet; closes via Cancel or background click

- `components/dashboard/dashboard-actions-client.tsx`

  - Client-only actions row that contains:
    - Bulk Upload (non-functional)
    - - Add Item button that opens the create modal

- `components/dashboard/dashboard-client.tsx`
  - Client wrapper that owns the dashboard’s interactive visual grid
  - Exports two components:
    - `DashboardClient`: renders the sample grid of `ItemCard`s
    - `DashboardHeaderActions`: renders the header actions (`DashboardActionsClient`)

#### Page updates

- `app/dashboard/page.tsx`
  - Remains a Server Component for auth/redirect (`currentUser()` + `redirect`) and page shell (navbar + header)
  - Imports and renders `DashboardHeaderActions` and `DashboardClient` (both client-side)
  - Removed `next/dynamic(..., { ssr:false })` usage from this Server Component

### Layout & styling

- Header area

  - Title: “Furniture Inventory”
  - Subtitle: “Manage your chairs, tables, and centerpieces”
  - Right-aligned actions: `Bulk Upload` (outline), `+ Add Item` (black/primary)

- Card grid

  - Responsive grid: 1/2/3/4 columns on small → large
  - Each card contains a thumbnail placeholder, title, optional SKU row, tag pill, and Edit/Delete buttons

- TailwindCSS used with existing project tokens and utilities

### Server vs Client components: design choice and error fix

#### The error

While building, Next.js threw the following error:

> `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.

This happened because `app/dashboard/page.tsx` is a Server Component and attempted to do:

```ts
const ItemCard = nextDynamic(() => import("@/components/dashboard/item-card"), {
  ssr: false,
});
```

Disabling SSR from within a Server Component contradicts the Server Component model.

#### Resolution

- Keep `app/dashboard/page.tsx` as a Server Component for server-only features (auth + redirects).
- Move interactive, client-only UI (actions, modal, grid) into a dedicated client wrapper.
- Import that client wrapper into the server page (no `ssr:false` needed). Next will hydrate client components on the browser automatically.

This mirrors guidance in `agent/docs/building-dashboard-ui.md`, which expects client-managed state and TanStack Query in the dashboard UI, while keeping server-only concerns in the page-level server component.

### File overview

- `app/dashboard/page.tsx` — server page shell and header, renders client components
- `components/dashboard/dashboard-client.tsx` — client wrapper for actions and card grid
- `components/dashboard/dashboard-actions-client.tsx` — client actions (+ modal open)
- `components/dashboard/create-item-modal.tsx` — visual modal with placeholder inputs
- `components/dashboard/item-card.tsx` — visual card component with tag pill and buttons

### How to extend next

When ready to add functionality:

1. Data fetching and cache

   - Use TanStack Query in a client component (grid wrapper) to call `listItemsApi()`
   - Render `ItemCard`s from the result; clicking a card can open a single modal instance

2. CRUD APIs

   - Extend `app/api/items/route.ts` to support list/update/delete as outlined in `agent/docs/building-dashboard-ui.md`
   - Add `listItemsApi`, `updateItemApi`, `deleteItemApi` in `lib/frontend/api.ts`

3. Modal behavior

   - Add `mode: 'view' | 'edit'`, patch updates, support delete, and wire optimistic cache updates

4. Accessibility & polish
   - Replace basic modal with a11y-ready dialog (e.g., Radix UI) with focus trap and ESC close

### Developer notes

- Avoid `next/dynamic(..., { ssr:false })` in Server Components. If you need client-only behavior, import a client wrapper component into the server page instead.
- Keep `app/dashboard/page.tsx` server-rendered so `currentUser()` and server redirects remain first-class.
- The current UI sample data is hard-coded in `DashboardClient`. Swap it for query results later.

### Screenshots (reference style)

The current UI mirrors the provided reference: header + actions, followed by a clean card grid. Filtering/search controls are intentionally omitted for now per requirements.
