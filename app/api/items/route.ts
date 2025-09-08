import {
  createItem,
  getItemById,
  DuplicateItemError,
  deleteItemById,
} from "@/lib/server/items-helpers";

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // check if id is missing and/or trim
    if (id === null || id.trim() === "") {
      return Response.json(
        { ok: false, error: "Missing required 'id' query param" },
        { status: 400 }
      );
    }

    // regex check for positive integer
    const trimmedId = id.trim();
    if (!/^\d+$/.test(trimmedId)) {
      return Response.json(
        { ok: false, error: "Invalid 'id' - must be a positive integer" },
        { status: 400 }
      );
    }

    // check if item exists
    const item = await getItemById(trimmedId);
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
    const { name, description, userId } = body ?? {};

    // Type validation and white space removal
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof userId !== "string" ||
      name.trim() === "" ||
      description.trim() === "" ||
      userId.trim() === ""
    ) {
      return Response.json(
        {
          ok: false,
          error: "Missing or invalid fields: name, description, userId",
        },
        { status: 400 }
      );
    }

    const item = await createItem({ name, description, userId });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id === null || id.trim() === "") {
      return Response.json(
        { ok: false, error: "Missing required 'id' query param" },
        { status: 400 }
      );
    }

    const trimmedId = id.trim();
    if (!/^\d+$/.test(trimmedId)) {
      return Response.json(
        { ok: false, error: "Invalid 'id' - must be a positive integer" },
        { status: 400 }
      );
    }

    const deleted = await deleteItemById(trimmedId);
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
