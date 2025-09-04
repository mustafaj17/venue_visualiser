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

// Lazily initialize the database client to avoid crashing when DATABASE_URL is absent
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
  if (cachedDb !== undefined) {
    console.log("🔄 Using cached database connection");
    return cachedDb;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "❌ Database connection failed: DATABASE_URL environment variable is not set"
    );
    cachedDb = null;
    return cachedDb;
  }

  try {
    console.log("🔌 Connecting to PostgreSQL database...");

    const sql = postgres(url, {
      ssl: "prefer",
      onnotice: (notice) => console.log("📢 PostgreSQL notice:", notice),
      transform: {
        undefined: null,
      },
    });

    cachedDb = drizzle(sql);
    console.log("✅ Database connection successful");
    return cachedDb;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    cachedDb = null;
    return cachedDb;
  }
}
