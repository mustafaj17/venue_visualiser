import { db, UsersTable } from "@/lib/drizzle";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import RefreshButton from "./refresh-button";
import { seed } from "@/lib/seed";

const MOCK_USERS = [
  {
    name: "Guillermo Rauch",
    email: "rauchg@vercel.com",
    image:
      "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
    createdAt: new Date(),
  },
  {
    name: "Lee Robinson",
    email: "lee@vercel.com",
    image:
      "https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg",
    createdAt: new Date(),
  },
  {
    name: "Steven Tey",
    email: "stey@vercel.com",
    image:
      "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg",
    createdAt: new Date(),
  },
];

export default async function Table() {
  const postgresUrl = process.env.POSTGRES_URL;
  let users;
  let duration = 0;

  if (!postgresUrl) {
    users = MOCK_USERS;
  } else {
    let startTime = Date.now();
    try {
      users = await db.select().from(UsersTable);
    } catch (e: any) {
      if (e.message === `relation "profiles" does not exist`) {
        console.log(
          "Table does not exist, creating and seeding it with dummy data now..."
        );
        await seed();
        startTime = Date.now();
        users = await db.select().from(UsersTable);
      } else {
        throw e;
      }
    }
    duration = Date.now() - startTime;
  }

  return (
    <div className='bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full'>
      <div className='flex justify-between items-center mb-4'>
        <div className='space-y-1'>
          <h2 className='text-xl font-semibold'>Recent Users</h2>
          <p className='text-sm text-gray-500'>
            Fetched {users.length} users in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className='divide-y divide-gray-900/5'>
        {users.map((user) => (
          <div
            key={user.name}
            className='flex items-center justify-between py-3'
          >
            <div className='flex items-center space-x-4'>
              <Image
                src={user.image}
                alt={user.name}
                width={48}
                height={48}
                className='rounded-full ring-1 ring-gray-900/5'
              />
              <div className='space-y-1'>
                <p className='font-medium leading-none'>{user.name}</p>
                <p className='text-sm text-gray-500'>{user.email}</p>
              </div>
            </div>
            <p className='text-sm text-gray-500'>{timeAgo(user.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
