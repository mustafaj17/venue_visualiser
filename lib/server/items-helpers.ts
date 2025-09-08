import { db, ItemsTable, type Item } from "./drizzle";
import { and, eq } from "drizzle-orm";

export class DuplicateItemError extends Error {
  constructor(message = "Item already exists") {
    super(message);
    this.name = "DuplicateItemError";
  }
}

export async function getItemById(id: string): Promise<Item | null> {
  const rows = await db
    .select()
    .from(ItemsTable)
    .where(eq(ItemsTable.id, parseInt(id)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createItem(params: {
  name: string;
  description: string;
  userId: string;
}): Promise<Item> {
  const name = params.name.trim();
  const description = params.description.trim();
  const userId = params.userId.trim();

  const rows = await db
    .insert(ItemsTable)
    .values({ name, description, userId })
    .onConflictDoNothing()
    .returning();

  if (rows[0]) return rows[0];

  const existing = await db
    .select()
    .from(ItemsTable)
    .where(
      and(
        eq(ItemsTable.name, name),
        eq(ItemsTable.description, description),
        eq(ItemsTable.userId, userId)
      )
    )
    .limit(1);

  if (existing[0]) {
    throw new DuplicateItemError();
  }

  throw new Error("Failed to create item");
}
