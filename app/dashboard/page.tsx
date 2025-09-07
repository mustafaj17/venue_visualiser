import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import ApiTestingPanel from "@/components/api-testing-panel";

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
      <main className='min-h-screen px-6 py-10 flex flex-col items-start mx-auto max-w-5xl'>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
          Welcome, {userName}
        </h1>
        <ApiTestingPanel />
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
