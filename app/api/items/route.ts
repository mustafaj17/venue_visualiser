import {
  createItem,
  getItemById,
  DuplicateItemError,
  deleteItemById,
} from "@/lib/server/items-helpers";
import { idQuerySchema, createItemBodySchema } from "@/lib/server/zod-schemas";

/*
Update (PATCH) plan for /api/items

- Method: PATCH /api/items?id=<number>
- Body: optional fields { name?: string; description?: string; userId?: string }

Flow:
1) Validate `id` query param (must be a positive integer).
2) Parse JSON body and build an `updates` object from an allowlist of fields.
   - Only include keys that are present and valid (non-empty strings after trim).
3) If `updates` is empty → respond 400 ("No valid fields to update").
4) Execute partial update:
   db.update(ItemsTable).set(updates).where(eq(ItemsTable.id, id)).returning()
   - If 0 rows returned → 404 ("Item not found").
5) Handle uniqueness collisions from the DB → 409 ("Item already exists").
6) Respond 200 with the updated item.

Notes:
- This supports partial updates; clients send only changed fields.
- Prefer PATCH for partial updates; PUT is for full replacement.
*/

export async function GET(request: Request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    // Validate and coerce `?id=` from the query into a positive integer
    const parsed = idQuerySchema.safeParse(params);
    if (!parsed.success) {
      // Return uniform 400 with Zod's flattened field errors
      return Response.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Use validated id; cast to string to match helper signature
    const item = await getItemById(String(parsed.data.id));
    if (!item) {
      return Response.json(
        { ok: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return Response.json({ ok: true, item }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate request body; trims strings and requires non-empty values
    const parsed = createItemBodySchema.safeParse(body);
    if (!parsed.success) {
      // Send structured validation errors from Zod
      return Response.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // `parsed.data` is typed and normalized according to the schema
    const item = await createItem(parsed.data);
    return Response.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateItemError) {
      return Response.json(
        { ok: false, error: "Item already exists" },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    // Same query validation as GET; ensures positive integer id
    const parsed = idQuerySchema.safeParse(params);
    if (!parsed.success) {
      // 400 with detailed field errors
      return Response.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Use validated id (cast to string for helper)
    const deleted = await deleteItemById(String(parsed.data.id));
    if (!deleted) {
      return Response.json(
        { ok: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
