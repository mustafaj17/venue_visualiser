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

export async function deleteItemById(id: string): Promise<Item | null> {
  const numericId = parseInt(id);
  if (Number.isNaN(numericId) || numericId <= 0) {
    throw new Error("Invalid id");
  }

  const rows = await db
    .delete(ItemsTable)
    .where(eq(ItemsTable.id, numericId))
    .returning();

  return rows[0] ?? null;
}

export async function listItemsByUserId(userId: string): Promise<Item[]> {
  const trimmedUserId = userId.trim();
  if (!trimmedUserId) {
    throw new Error("Invalid userId");
  }

  const rows = await db
    .select()
    .from(ItemsTable)
    .where(eq(ItemsTable.userId, trimmedUserId));

  return rows;
}

export async function updateItemById(
  id: string,
  updates: Partial<Pick<Item, "name" | "description">>
): Promise<Item | null> {
  const numericId = parseInt(id);
  if (Number.isNaN(numericId) || numericId <= 0) {
    throw new Error("Invalid id");
  }

  const normalizedUpdates: Partial<Pick<Item, "name" | "description">> = {};
  if (typeof updates.name === "string") {
    const trimmed = updates.name.trim();
    if (trimmed) normalizedUpdates.name = trimmed;
  }
  if (typeof updates.description === "string") {
    const trimmed = updates.description.trim();
    if (trimmed) normalizedUpdates.description = trimmed;
  }

  if (Object.keys(normalizedUpdates).length === 0) {
    return null; // Nothing to update
  }

  const rows = await db
    .update(ItemsTable)
    .set(normalizedUpdates)
    .where(eq(ItemsTable.id, numericId))
    .returning();

  return rows[0] ?? null;
}
