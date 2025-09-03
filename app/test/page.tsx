import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TestRBACPage() {
  const session = await auth();

  // If not signed in, redirect to sign-in
  if (!session?.userId) {
    redirect("/sign-in");
  }

  // Normalize role: support values like "admin", "owner", "org:admin", "org:owner"
  const rawRole =
    (session.orgRole as string | undefined) ??
    (session.sessionClaims?.org_role as string | undefined);
  const normalizedRole = rawRole?.replace(/^org:/, "");

  // If signed in but not an admin/owner, redirect to not authorized
  if (normalizedRole !== "admin" && normalizedRole !== "owner") {
    redirect("/not-authorized");
  }

  return (
    <>
      <Navbar />
      <main className='min-h-screen px-6 py-10 flex flex-col items-start mx-auto max-w-5xl'>
        <div className='mb-4'>
          <Link href='/dashboard'>
            <button className='rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 hover:bg-gray-900 active:opacity-90 transition'>
              Go back
            </button>
          </Link>
        </div>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
          Admin RBAC Test
        </h1>
        <p className='mt-3 text-gray-700'>
          You can see this because you're an admin.
        </p>
      </main>
    </>
  );
}
