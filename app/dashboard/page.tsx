import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-client";
import DashboardClient from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Load the signed-in user's basic profile for greeting
  const user = await currentUser();
  if (!user) {
    return redirect(`/sign-in?redirect_url=/dashboard`);
  }
  const userName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "there";

  return (
    <>
      <Navbar />
      <main className='min-h-screen px-8 py-10 flex flex-col items-start mx-auto max-w-7xl'>
        <div className='w-full flex items-start justify-between'>
          <div>
            <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
              Furniture Inventory
            </h1>
            <p className='mt-2 text-sm text-gray-500'>
              Manage your chairs, tables, and centerpieces
            </p>
          </div>

          <DashboardHeaderActions />
        </div>

        <DashboardClient />
      </main>
    </>
  );
}

// Client-only actions moved to `components/dashboard/dashboard-actions-client.tsx`
