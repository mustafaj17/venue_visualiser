## Auth setup overview (simplified)

### What’s implemented

- **Clerk integration**: App wrapped with `ClerkProvider` in `app/layout.tsx`.
- **Middleware**: `middleware.ts` uses `clerkMiddleware` to attach auth context.
- **No organizations / no RBAC**: All organization and role logic has been removed.
- **Dashboard greeting**: `app/dashboard/page.tsx` greets the signed-in user by name only.

### Behavior

- Signed-in users can access the dashboard; it simply shows “Welcome, {name}”.
- No role badges, no org switching, and no restricted RBAC routes.
- The previous RBAC test page (`/test`) has been deleted.

### How to verify

1. Sign in and visit `/dashboard`.
2. Confirm the greeting shows only your name (no role/org info).

### Notes

- If future role-based features are needed, reintroduce org/role claims via Clerk and route guards.
