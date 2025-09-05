## Choosing our Next.js backend approach: Server Actions vs BFF (Route Handlers)

This doc explains two viable patterns for CRUD and domain logic in a Next.js App Router project and when to pick each. It’s meant to help us decide whether we build a very Server Action–driven app or a more traditional BFF (Backend-for-Frontend) with explicit API routes.

### TL;DR

- For CRUD that originates from our own Next UI, prefer **Server Actions** for speed, simplicity, and co-location with components.
- When we need an external API surface (mobile, third-party integrations, webhooks) or want explicit API ergonomics (rate limiting, versioning, observability), build a **BFF using Route Handlers** under `app/api/**`.

---

## Glossary

- **Server Actions**: Server-only functions invoked by forms or client actions without writing HTTP fetches. Ideal for UI-bound mutations and page cache invalidation via `revalidatePath`/tags.
- **BFF (Route Handlers)**: HTTP controllers at `app/api/**/route.ts` implementing REST/RPC. Good for multiple clients, webhooks, and explicit API concerns.
- **Service layer**: Server-only domain logic called from either pattern (enables reuse and future extraction).
- **Repository**: DB access (Drizzle) isolated from services.

---

## Option A — Server Actions (UI-first)

### How it works

- A form or client component invokes a server action (`'use server'`), which runs on the server, performs validation, uses Drizzle, and revalidates affected paths/tags.

### Strengths

- **Low boilerplate**: no fetch or JSON plumbing.
- **Co-location** with the component that consumes the mutation.
- **Built-in CSRF protection** and easy `auth()` checks.
- **Great DX**: `useActionState`, optimistic UI, `revalidatePath`/`revalidateTag`.

### Trade-offs

- Not directly callable by non-React clients.
- Less explicit API contract, versioning, and rate limiting.
- Not suited for long-running work; use queues/workers for that.

### When to choose

- Internal UI-only CRUD, dashboards, and admin flows.
- Fast iteration with minimal API surface area.

### Items CRUD in this style

- `app/items/new/page.tsx` uses a `createItemAction`.
- `createItemAction` calls `server/items/items.service.ts#create`.
- On success: `revalidatePath('/items')`.

---

## Option B — BFF via Route Handlers (HTTP-first)

### How it works

- Controllers under `app/api/**/route.ts` receive HTTP requests, call services, and return JSON. Our React app and any external client consume the same API.

### Strengths

- **Multi-client** ready (web, mobile, partners).
- **API controls**: versioning, rate limiting, API keys, monitoring.
- **Webhooks & machine-to-machine** friendly.

### Trade-offs

- More boilerplate (request parsing, errors, JSON).
- Need to handle CSRF if cookie-auth for browser calls.
- Slightly slower to iterate than actions for purely internal flows.

### When to choose

- Mobile app or third-party integrations.
- Webhooks, scheduled jobs calling HTTP endpoints.
- We need a stable, documented API contract.

### Items CRUD in this style

- `app/api/items/route.ts` → `GET` list, `POST` create.
- `app/api/items/[id]/route.ts` → `GET`, `PATCH`, `DELETE`.
- Controllers call `server/items/items.service.ts`.

---

## Shared structure (recommended either way)

- `server/items/items.schema.ts` — Zod models for input/output.
- `server/items/items.repo.ts` — Drizzle queries (no HTTP).
- `server/items/items.service.ts` — business rules, auth checks, invariants.
- `app/api/**` — only if we choose BFF or need external endpoints.
- `app/**` pages/components — call Server Actions directly or fetch our BFF.

Add `import 'server-only'` to server modules to prevent client bundling.

Example layout:

```
server/
  items/
    items.schema.ts
    items.repo.ts
    items.service.ts
app/
  items/
    page.tsx
  api/
    items/
      route.ts
    items/[id]/
      route.ts
```

---

## Security considerations

- **Auth**: Check `auth()` inside actions/services, not in components.
- **CSRF**: Server Actions are protected by design; for API routes with cookie auth, use CSRF tokens or switch to header/token auth.
- **Input validation**: Enforce at the service boundary with Zod; never trust client types.
- **Data access**: Keep RBAC/ABAC inside services so both patterns share consistent rules.

---

## Testing and observability

- **Unit test** services and repos directly (no HTTP).
- **Integration test**:
  - Server Actions via invoking the action function with mock `FormData`.
  - BFF controllers via HTTP requests to `app/api` routes.
- **Observability**: BFF makes request-level metrics easier (status codes, latency, rate limits). For Server Actions, add logging/metrics inside the service layer.

---

## Performance & scaling

- Server Actions minimize roundtrips and are cache-aware with `revalidatePath`.
- BFF introduces HTTP overhead but decouples clients and enables edge caching policies.
- For long-running tasks or heavy compute: offload to a queue/worker (Inngest, Temporal, Trigger.dev, QStash).

---

## Migration path (keep options open)

- Put domain logic in `server/**`. Start with Server Actions for internal CRUD.
- If/when we need external access, add API routes that call the same services.
- This avoids rewrites and lets us evolve toward a service-oriented shape later.

---

## Decision checklist

- Is the consumer only our React UI? → Prefer **Server Actions**.
- Do we need mobile/partner API, webhooks, or rate limiting? → **BFF**.
- Do we need explicit API versioning or SDKs? → **BFF**.
- Do we need fastest possible UI iteration with cache revalidation? → **Server Actions**.
- Do we need background jobs/long-running tasks? → Either pattern + a worker.

---

## Recommendation for `venue_visualiser`

- Default to **Server Actions** for the app’s internal CRUD (e.g., Items).
- Prepare for future expansion by keeping all domain logic in `server/**`.
- Add **BFF endpoints** only when we introduce a second client, webhooks, or need API-specific controls.

---

## Concrete next steps (if we choose Server Actions first)

- Create `server/items/*` (schema, repo, service).
- Wire `create/update/delete` Server Actions in `app/items/*` and use `revalidatePath('/items')`.
- Add minimal logging in services for action observability.

## Concrete next steps (if we choose BFF first)

- Same `server/items/*`, plus:
- Add `app/api/items` and `app/api/items/[id]` controllers calling services.
- Introduce request validation mapping Zod errors → HTTP 400; add auth checks and rate limiting middleware if needed.

---

## Appendix: tiny examples

Server Action:

```tsx
// app/items/new/page.tsx
import { revalidatePath } from "next/cache";
import { create } from "@/server/items/items.service";

async function createItemAction(_: unknown, form: FormData) {
  "use server";
  await create({
    name: String(form.get("name") || ""),
    description: String(form.get("description") || ""),
  });
  revalidatePath("/items");
}
```

BFF Controller:

```ts
// app/api/items/route.ts
import { NextResponse } from "next/server";
import { create, list } from "@/server/items/items.service";

export async function GET() {
  return NextResponse.json(await list());
}
export async function POST(req: Request) {
  const body = await req.json();
  const created = await create(body);
  return NextResponse.json(created, { status: 201 });
}
```
