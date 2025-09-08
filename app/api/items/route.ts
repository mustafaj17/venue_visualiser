import { createItem } from "@/lib/server/items-helpers";

export async function GET() {
  return Response.json({ items: [{ id: 1, name: "Hello, world!" }] });
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
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
