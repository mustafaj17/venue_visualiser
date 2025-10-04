## Building the Items Dashboard UI

### TanStack Query: keys and cache strategy

- Query keys
  - List: `['items', 'list']`
  - Single: `['items', id]`
- Create: invalidate list; optionally `setQueryData` to append.
- Update: `setQueryData(['items', id], updated)` and update list cache in place.
- Delete: remove from list cache; invalidate single.

Example wiring in a client component (grid):

```tsx
const listQuery = useQuery({
  queryKey: ["items", "list"],
  queryFn: () => listItemsApi({ limit: 10 }).then((r) => r.items),
});

const createMutation = useMutation({
  mutationFn: createItemApi,
  onSuccess: (res) => {
    queryClient.setQueryData<ItemDTO[] | undefined>(["items", "list"], (prev) =>
      prev ? [res.item, ...prev] : [res.item]
    );
  },
});
```

### Dashboard page flow

1. On mount, fetch first 10 items via `listItemsApi` using `useQuery`.
2. Render cards; clicking a card opens `ItemModal` in `view` mode.
3. Inside modal: Edit switches to `edit` mode; Save triggers update mutation and patches cache; Delete removes from cache and closes modal.
4. Create form on the page uses `createItemApi`; on success append to the list cache.

### Error handling & UX

- Use toasts for success/error feedback (you already use `sonner`).
- Disable buttons while `isPending`/`isFetching`.
- Keep UI responsive with optimistic cache updates where safe; fall back to invalidations on uncertain flows.
