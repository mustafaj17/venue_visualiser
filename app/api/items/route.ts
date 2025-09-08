import {
  createItem,
  getItemById,
  DuplicateItemError,
} from "@/lib/server/items-helpers";

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
