import Navbar from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotAuthorizedPage() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen px-6 py-10 flex flex-col items-start mx-auto max-w-5xl'>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
          Not authorized
        </h1>
        <p className='mt-3 text-gray-700'>
          You do not have permission to view this page.
        </p>
        <div className='mt-6 flex items-center gap-3'>
          <Button
            asChild
            className='rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 hover:bg-gray-900 active:opacity-90 transition'
          >
            <Link href='/sign-in'>
              Sign in
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            className='rounded-full text-gray-800 text-sm font-medium px-4 py-1.5 hover:bg-gray-50 active:opacity-90 transition'
          >
            <Link href='/sign-up'>
              Sign up
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
