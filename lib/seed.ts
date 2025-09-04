import { getDb, UsersTable, type NewUser } from "./drizzle";

export async function seed() {
  const db = getDb();
  if (!db) {
    throw new Error("Cannot seed without DATABASE_URL set");
  }

  // Create table using Drizzle schema
  console.log(`Ensuring "profiles" table exists`);

  const seedUsers: NewUser[] = [
    {
      name: "Guillermo Rauch",
      email: "rauchg@vercel.com",
      image:
        "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
    },
    {
      name: "Lee Robinson",
      email: "lee@vercel.com",
      image:
        "https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg",
    },
    {
      name: "Steven Tey",
      email: "stey@vercel.com",
      image:
        "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg",
    },
  ];

  // Insert users with conflict resolution
  const insertedUsers = await db
    .insert(UsersTable)
    .values(seedUsers)
    .onConflictDoNothing()
    .returning();

  console.log(`Seeded ${insertedUsers.length} users`);

  return {
    insertedUsers,
  };
}
