## Building the Items Dashboard UI (Next.js BFF + Drizzle + TanStack Query)

### Goals

- Display 5–10 item cards on the dashboard.
- Open a single reusable modal when a card is clicked.
- Modal supports two modes: view (read-only) and edit (form).
- Create via a small form on the page; delete via a button inside the modal.
- Read occurs on page load (client-side via TanStack Query).

### Tech stack assumptions

- Next.js App Router with BFF Route Handlers in `app/api`.
- Drizzle ORM for schema and DB access.
- TanStack Query for data fetching, cache updates, and mutations.
- Existing files to note:
  - `app/api/items/route.ts` currently supports GET by `id` and POST create.
  - `lib/server/items-helpers.ts` has `getItemById`, `createItem`.
  - `lib/server/drizzle.ts` exposes `ItemsTable` and `type Item`.
  - `lib/frontend/api.ts` has `getItems(id?)` and `createItemApi`.
  - `app/providers.tsx` sets up `QueryClientProvider`.

### Backend API design

To fully support dashboard CRUD, add these operations:

- List items: `GET /api/items` (no `id`) → returns `{ ok: true, items: Item[] }` (supports optional `limit`, `offset`).
- Get single item: `GET /api/items?id=123` (already present) → `{ ok: true, item }`.
- Create item: `POST /api/items` (already present) → `{ ok: true, item }`.
- Update item: `PATCH /api/items?id=123` (or `PUT`) → `{ ok: true, item }`.
- Delete item: `DELETE /api/items?id=123` → `{ ok: true }`.

Notes:

- Keeping `id` as a query param matches the current GET shape and avoids creating `app/api/items/[id]/route.ts`. If you prefer RESTful paths, you can split into a `[id]` route; the UI wiring is the same.
- Return `{ ok, ... }` consistently and appropriate status codes (400, 404, 409, 500).

### Frontend API wrappers (`lib/frontend/api.ts`)

Add thin axios wrappers for list/update/delete to complement what you already have:

```ts
export type ItemDTO = {
  id: number;
  name: string;
  description: string;
  userId: string;
};

export async function listItemsApi(params?: {
  limit?: number;
  offset?: number;
}) {
  const response = await axios.get("/api/items", { params });
  return response.data as { ok: boolean; items: ItemDTO[] };
}

export type UpdateItemInput = Partial<Pick<ItemDTO, "name" | "description">>;

export async function updateItemApi(id: number, input: UpdateItemInput) {
  const response = await axios.patch("/api/items", input, { params: { id } });
  return response.data as { ok: boolean; item: ItemDTO };
}

export async function deleteItemApi(id: number) {
  const response = await axios.delete("/api/items", { params: { id } });
  return response.data as { ok: boolean };
}
```

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

### UI architecture

- One modal instance at the page level, controlled by `selectedItem` and `isModalOpen`.
- Modal has local `mode: 'view' | 'edit'` and `isSaving` state.
- Parent is responsible for opening/closing and list updates. Modal emits `onUpdated(item)` and `onDeleted(id)` to allow local cache updates without a full refetch.

Parent (cards + modal):

```tsx
const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);
const [open, setOpen] = useState(false);

function openModal(item: ItemDTO) {
  setSelectedItem(item);
  setOpen(true);
}

<ItemModal
  open={open}
  item={selectedItem}
  onClose={() => setOpen(false)}
  onUpdated={(updated) => {
    queryClient.setQueryData<ItemDTO[] | undefined>(["items", "list"], (prev) =>
      prev ? prev.map((i) => (i.id === updated.id ? updated : i)) : prev
    );
    queryClient.setQueryData<ItemDTO>(["items", updated.id], updated);
  }}
  onDeleted={(id) => {
    queryClient.setQueryData<ItemDTO[] | undefined>(["items", "list"], (prev) =>
      prev ? prev.filter((i) => i.id !== id) : prev
    );
    queryClient.removeQueries({ queryKey: ["items", id] });
    setOpen(false);
  }}
/>;
```

Modal (view ↔ edit):

```tsx
type ModalMode = "view" | "edit";

function ItemModal({
  open,
  item,
  onClose,
  onUpdated,
  onDeleted,
}: {
  open: boolean;
  item: ItemDTO | null;
  onClose: () => void;
  onUpdated: (item: ItemDTO) => void;
  onDeleted: (id: number) => void;
}) {
  const [mode, setMode] = useState<ModalMode>("view");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setMode("view");
    }
  }, [item?.id]);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateItemInput) => updateItemApi(item!.id, input),
    onSuccess: (res) => onUpdated(res.item),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteItemApi(item!.id),
    onSuccess: () => onDeleted(item!.id),
  });

  async function handleSave() {
    setSaving(true);
    try {
      await updateMutation.mutateAsync({ name, description });
      setMode("view");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (
          !o &&
          mode === "edit" &&
          (name !== item?.name || description !== item?.description)
        ) {
          if (!confirm("Discard changes?")) return;
        }
        onClose();
      }}
    >
      <DialogContent>
        {mode === "view" ? (
          <div>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>{item?.name}</h3>
              <div className='flex gap-2'>
                <Button onClick={() => setMode("edit")}>Edit</Button>
                <Button
                  variant='destructive'
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </div>
            <p className='mt-2 text-sm text-gray-600'>{item?.description}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name'
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description'
            />
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => {
                  setName(item!.name);
                  setDescription(item!.description);
                  setMode("view");
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  saving ||
                  (name === item?.name && description === item?.description)
                }
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

Notes:

- Use your existing `Button` and `Input` from `components/ui`. For the modal, add a `Dialog` implementation (e.g., Radix UI or shadcn/ui) if you don't have one yet.
- Guard against closing with unsaved changes.

### Dashboard page flow

1. On mount, fetch first 10 items via `listItemsApi` using `useQuery`.
2. Render cards; clicking a card opens `ItemModal` in `view` mode.
3. Inside modal: Edit switches to `edit` mode; Save triggers update mutation and patches cache; Delete removes from cache and closes modal.
4. Create form on the page uses `createItemApi`; on success append to the list cache.

### Error handling & UX

- Use toasts for success/error feedback (you already use `sonner`).
- Disable buttons while `isPending`/`isFetching`.
- Keep UI responsive with optimistic cache updates where safe; fall back to invalidations on uncertain flows.

### Backend additions checklist

- [ ] Extend `GET /api/items` to support listing when `id` is absent (limit/offset).
- [ ] Add `PATCH /api/items?id=ID` for updates with input validation.
- [ ] Add `DELETE /api/items?id=ID` for deletions with existence checks.
- [ ] Mirror error shapes and status codes used in existing handlers.

### Frontend additions checklist

- [ ] Add `listItemsApi`, `updateItemApi`, `deleteItemApi` in `lib/frontend/api.ts`.
- [ ] Build `ItemModal` with `view` ↔ `edit` mode.
- [ ] Wire list query and mutations; maintain cache for list and single.
- [ ] Add simple create form and connect to create mutation.

### References in this repo

- `app/api/items/route.ts` (current GET by `id` + POST create)
- `lib/server/items-helpers.ts` (DB helpers)
- `lib/server/drizzle.ts` (schema + types)
- `lib/frontend/api.ts` (axios wrappers)
- `components/dashboard/api-testing-panel.tsx` (working patterns for TanStack Query + toasts)
- `app/providers.tsx` (QueryClientProvider)
