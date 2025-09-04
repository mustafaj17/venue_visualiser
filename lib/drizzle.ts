import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Lazily initialize the database client to avoid crashing when POSTGRES_URL is absent
let cachedDb: PostgresJsDatabase | null | undefined;

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

export type User = InferSelectModel<typeof UsersTable>;
export type NewUser = InferInsertModel<typeof UsersTable>;

export function getDb(): PostgresJsDatabase | null {
  if (cachedDb !== undefined) return cachedDb;

  const url = process.env.POSTGRES_URL;
  if (!url) {
    cachedDb = null;
    return cachedDb;
  }

  const sql = postgres(url, {
    ssl: "prefer",
    onnotice: (notice) => console.log("PostgreSQL notice:", notice),
    transform: {
      undefined: null,
    },
  });

  cachedDb = drizzle(sql);
  return cachedDb;
}
