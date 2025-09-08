# API Overview

This doc summarizes the current API surface and how to call it.

## File structure (API-related)

```
app/
  api/
    items/
      route.ts        // GET (by id), POST (create), DELETE (by id)
lib/
  frontend/
    api.ts            // Axios-based client helpers
  server/
    items-helpers.ts  // DB helpers used by the route
middleware.ts          // Clerk auth middleware applied to API routes
```

## Authentication

- Clerk middleware runs for all API routes (`middleware.ts`).
- If an endpoint later requires user context, we can access it via Clerk. Current `items` endpoints do not read auth context yet.

## Routes

### Items

Base path: `/api/items`

- GET `/api/items?id=<number>`

  - Required query: `id` (positive integer)
  - Returns: `{ ok: true, item }` or `{ ok: false, error }`
  - Errors: `400` (missing/invalid id), `404` (not found)

- POST `/api/items`

  - Body (JSON): `{ name: string, description: string, userId: string }`
  - Returns: `201` with `{ ok: true, item }`
  - Errors: `400` (validation), `409` (duplicate), `500` (unexpected)

- DELETE `/api/items?id=<number>`
  - Required query: `id` (positive integer)
  - Returns: `200` with `{ ok: true }`
  - Errors: `400` (invalid id), `404` (not found)

## Response shapes

- Success (GET): `{ ok: true, item }`
- Success (POST): `{ ok: true, item }`
- Success (DELETE): `{ ok: true }`
- Error: `{ ok: false, error: string }`

## Examples

### cURL

- GET by id

```bash
curl -sS \
  -G "http://localhost:3000/api/items" \
  --data-urlencode "id=1"
```

- Create item

```bash
curl -sS \
  -X POST "http://localhost:3000/api/items" \
  -H "Content-Type: application/json" \
  -d '{"name":"Item A","description":"Desc","userId":"user_123"}'
```

- Delete by id

```bash
curl -sS \
  -X DELETE \
  -G "http://localhost:3000/api/items" \
  --data-urlencode "id=1"
```

### Frontend helpers (Axios)

Located in `lib/frontend/api.ts`.

```ts
// GET by id (optional id param); returns route JSON
getItems(id?: string)

// Create item; returns route JSON
createItemApi({ name, description, userId })
```

That’s it. Keep routes thin; move DB logic into `lib/server/*` helpers.
