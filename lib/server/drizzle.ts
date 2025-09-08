import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const UsersTable = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const ItemsTable = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    userId: text("userId").notNull(), // Foreign key to UsersTable
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
  itemId: text("itemId").notNull(),
  filePath: text("filePath").notNull(), // GCP file path
});

export type User = InferSelectModel<typeof UsersTable>;
export type NewUser = InferInsertModel<typeof UsersTable>;

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
