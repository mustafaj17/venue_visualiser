## Auth setup overview

### What’s implemented

- **Clerk integration**: App wrapped with `ClerkProvider` in `app/layout.tsx`.
- **Middleware**: `middleware.ts` uses `clerkMiddleware` with a broad matcher to attach auth context on requests.
- **Organizations**: Clerk Organizations enabled. UI uses `OrganizationSwitcher` in `components/navbar.tsx` with:
  - `afterSelectOrganizationUrl='/dashboard'`
  - `afterLeaveOrganizationUrl='/dashboard'`
- **Dashboard role display**: `app/dashboard/page.tsx` reads org context server‑side via `auth()` and `sessionClaims`.
  - Determines active org using `orgId || sessionClaims.org_id`.
  - Normalizes role (strips `org:` prefix).
  - **Shows role only when an active org exists** (personal workspace hides role).
- **RBAC test**: `app/test/page.tsx` requires sign‑in and restricts to `admin`/`owner` roles; others redirect to `not-authorized`.

### Claims used (minimal)

- `org_id`, `org_role`, `org_slug` when available from Clerk session/JWT.
- See `docs/clerk-orgs-claims.md` for recommended JWT template and details.

### Behavior notes

- Switching to **personal workspace** clears active org; dashboard stops showing admin role.
- Switching between orgs updates role badge on the dashboard after navigation.

### How to test quickly

1. Sign in and go to `/dashboard`.
2. Use the org switcher to pick an org where you’re an admin/owner → role badge is shown.
3. Switch to personal workspace → role badge disappears.
4. Visit `/test`:
   - Admin/owner in active org → page loads.
   - Non‑admin (or in personal) → redirected to `/not-authorized`.

### Next steps (optional)

- Add per‑route guards in `middleware.ts` using `sessionClaims`.
- Centralize permission checks (utility) and use across API routes/server actions.
- If needed, extend JWT with a `permissions` array and enforce in backend/DB.
