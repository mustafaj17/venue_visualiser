import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Profiles table removed — users are not stored in a dedicated table.

export const ItemsTable = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    userId: text("userId").notNull(), // Clerk user UUID (stores Clerk-provided user id)
  },
  (items) => {
    return {
      itemsUnique: uniqueIndex("items_unique_name_description_userId").on(
        items.name,
        items.description,
        items.userId
      ),
    };
  }
);

export const AssetsTable = pgTable("assets", {
  id: serial("id").primaryKey(),
  // Store numeric item IDs to match `items.id` (serial integer).
  // Use integer here (not serial) because this column will hold existing
  // `items.id` values and should not create its own sequence.
  // This enables adding a foreign-key constraint and simplifies joins.
  itemId: integer("itemId").notNull(),
  filePath: text("filePath").notNull(), // GCP file path
});

// User types removed alongside the profiles table

export type Item = InferSelectModel<typeof ItemsTable>;
export type NewItem = InferInsertModel<typeof ItemsTable>;

export type Asset = InferSelectModel<typeof AssetsTable>;
export type NewAsset = InferInsertModel<typeof AssetsTable>;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it to connect to PostgreSQL."
  );
}

const sql = postgres(databaseUrl, {
  ssl: "prefer",
  onnotice: (notice) => console.log("📢 PostgreSQL notice:", notice),
  transform: {
    undefined: null,
  },
});

export const db = drizzle(sql);
