# Refactoring Guide: Custom Hooks for API Logic

This document outlines potential custom hooks that can be extracted from components when reuse opportunities arise.

## Current State

Currently, all API logic is embedded within components using React Query's `useMutation` and `useQuery`. This is perfectly fine for single-use scenarios and follows YAGNI principles.

## Future Refactoring Opportunities

### 1. Items Data Fetching Hook

**Current Location**: `components/dashboard/dashboard-client.tsx` (lines 10-18)

**When to Extract**: When you need to fetch items in multiple components (e.g., mobile app, admin panel, search results)

**Hook Structure**:

```typescript
// hooks/useItems.ts
export function useItems() {
  return useQuery<ItemDto[]>({
    queryKey: ["items", "me"],
    queryFn: fetchMyItems,
    staleTime: 30_000,
  });
}
```

**Benefits**:

- Centralized query configuration
- Consistent stale time across app
- Easy to add optimistic updates later

---

### 2. Create Item Hook

**Current Location**: `components/dashboard/create-item-modal.tsx` (lines 24-53)

**When to Extract**: When you need to create items from multiple places (e.g., bulk upload, API integration, mobile app)

**Hook Structure**:

```typescript
// hooks/useCreateItem.ts
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItemApi,
    onSuccess: () => {
      toast.success("Item created");
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
    },
    onError: (err) => {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      const serverMessage = anyErr?.response?.data?.error;

      if (status === 409) {
        toast.warning("Item already exists");
        return;
      }
      if (status === 400) {
        toast.error(serverMessage ?? "Invalid input");
        return;
      }
      toast.error("Failed to create item");
    },
  });
}
```

**Usage**:

```typescript
const createMutation = useCreateItem();
// Component handles form state, validation, and UI
```

---

### 3. Update Item Hook

**Current Location**: `components/dashboard/edit-item-modal.tsx` (lines 40-63)

**When to Extract**: When you need to update items from multiple places (e.g., inline editing, bulk operations, mobile app)

**Hook Structure**:

```typescript
// hooks/useUpdateItem.ts
export function useUpdateItem(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateItemInput) => updateItemApi(id, updates),
    onSuccess: () => {
      toast.success("Item updated");
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
    },
    onError: (err) => {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      const serverMessage = anyErr?.response?.data?.error;

      if (status === 400) {
        toast.error(serverMessage ?? "Invalid input");
        return;
      }
      if (status === 404) {
        toast.error("Item not found");
        return;
      }
      toast.error("Failed to update item");
    },
  });
}
```

---

### 4. Delete Item Hook

**Current Location**: `components/dashboard/item-card.tsx` (lines 21-26)

**When to Extract**: When you need to delete items from multiple places (e.g., bulk delete, admin panel, mobile app)

**Hook Structure**:

```typescript
// hooks/useDeleteItem.ts
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItemApi,
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
    },
    onError: (err) => {
      const anyErr = err as any;
      const status = anyErr?.response?.status;

      if (status === 404) {
        toast.error("Item not found");
        return;
      }
      toast.error("Failed to delete item");
    },
  });
}
```

**Usage**:

```typescript
const deleteMutation = useDeleteItem();
// Component handles confirmation dialog and UI
```

---

## Implementation Strategy

### Phase 1: Create Hooks Directory

```bash
mkdir hooks
touch hooks/useItems.ts
touch hooks/useCreateItem.ts
touch hooks/useUpdateItem.ts
touch hooks/useDeleteItem.ts
```

### Phase 2: Extract When Needed

1. **Identify reuse scenario** (e.g., mobile app needs same mutations)
2. **Extract one hook at a time** starting with the most reused
3. **Update components gradually** to use the new hooks
4. **Test thoroughly** to ensure behavior remains identical

### Phase 3: Advanced Features (Future)

When hooks are extracted, consider adding:

- **Optimistic updates** for better UX
- **Retry logic** for failed requests
- **Rate limiting** for bulk operations
- **Offline support** with React Query's offline capabilities

---

## Decision Triggers

Extract to custom hooks when you encounter:

1. **Multiple use cases**: Same mutation needed in 2+ components
2. **Complex error handling**: Error logic becomes too verbose for components
3. **Cross-cutting concerns**: Need to add logging, analytics, or retry logic
4. **Testing requirements**: Need to unit test API logic separately from UI
5. **Performance optimization**: Need optimistic updates or advanced caching

---

## Current Benefits of NOT Extracting

- **Simpler codebase**: Fewer files to maintain
- **Clear component boundaries**: Each component owns its API logic
- **Easier debugging**: Logic is co-located with UI
- **No premature abstraction**: Following YAGNI principles

---

_Last updated: When actual reuse scenarios emerge_
