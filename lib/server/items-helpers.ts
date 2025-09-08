import { db, ItemsTable, type Item } from "./drizzle";
import { eq } from "drizzle-orm";

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
  const { name, description, userId } = params;
  const rows = await db
    .insert(ItemsTable)
    .values({ name, description, userId })
    .returning();
  return rows[0];
}
