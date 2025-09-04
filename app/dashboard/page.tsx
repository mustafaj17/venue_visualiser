import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch the current auth context from Clerk for server-side reads
  // Note: we are not enforcing protection here yet
  const session = await auth();

  // Load the signed-in user's basic profile for greeting
  const user = await currentUser();
  const userName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "there";

  // Read active organization context from the session
  // - orgRole: role of this user in the active organization (e.g., admin/member)
  // - orgId/orgSlug: identifiers for the active organization
  // These are handy for RBAC checks later
  const { orgRole, orgId, orgSlug, sessionClaims } = session;
  const activeOrgId =
    (orgId as string | undefined) ??
    (sessionClaims?.org_id as string | undefined);
  const rawRole =
    (orgRole as string | undefined) ??
    (sessionClaims?.org_role as string | undefined);
  const normalizedRole = rawRole?.replace(/^org:/, "");
  const displayRole = activeOrgId ? normalizedRole : undefined;
  void orgSlug;

  return (
    <>
      <Navbar />
      <main className='min-h-screen px-6 py-10 flex flex-col items-start mx-auto max-w-5xl'>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
          Welcome, {userName}
        </h1>
        <div className='mt-2'>
          {displayRole ? (
            <span className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-gray-200'>
              Role:{" "}
              <span className='ml-1 font-medium capitalize'>{displayRole}</span>
            </span>
          ) : (
            <span className='text-sm text-red-500/80'>
              Could not retrieve your organization role. Please select an
              organization or re-authenticate.
            </span>
          )}
        </div>
        <div className='mt-6'>
          <Button
            asChild
            className='rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 hover:bg-gray-900 active:opacity-90 transition'
          >
            <Link href='/test'>
              Test RBAC
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className='mt-8 w-full border-t border-gray-200 pt-8'>
          <p className='text-gray-500'>Get started</p>
          <div className='mt-4 rounded-lg border border-dashed border-black h-64 w-full flex items-center justify-center text-gray-400'>
            This area will soon be your workspace.
          </div>
        </div>
      </main>
    </>
  );
}
