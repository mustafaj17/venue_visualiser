import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";
import ExpandingArrow from "@/components/expanding-arrow";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center'>
      <div className='absolute top-4 left-4 flex items-center space-x-3'>
        <h2 className='text-lg md:text-xl font-semibold text-gray-800'>
          Venue Visualiser
        </h2>
        <Link href='/dashboard'>
          <button className='rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 hover:bg-gray-900 active:opacity-90 transition'>
            Go to Dashboard
          </button>
        </Link>
      </div>
      <div className='absolute top-4 right-4'>
        <SignedOut>
          <SignInButton mode='modal'>
            <button className='rounded-full bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-700 text-sm font-medium px-4 py-1.5 hover:bg-white/40 hover:shadow-lg active:shadow-sm transition-all'>
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <Link
        href='https://vercel.com/templates/next.js/postgres-drizzle'
        className='group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all'
      >
        <p>Deploy your own to Vercel</p>
        <ExpandingArrow />
      </Link>
      <h1 className='pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl'>
        Postgres on Vercel
      </h1>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>
      <p className='font-light text-gray-600 w-full max-w-lg text-center mt-6'>
        Postgres demo with{" "}
        <Link
          href='https://github.com/drizzle-team/drizzle-orm'
          className='font-medium underline underline-offset-4 hover:text-black transition-colors'
        >
          Drizzle
        </Link>{" "}
        as the ORM. <br /> Built with{" "}
        <Link
          href='https://nextjs.org/docs'
          className='font-medium underline underline-offset-4 hover:text-black transition-colors'
        >
          Next.js App Router
        </Link>
        .
      </p>

      <div className='flex justify-center space-x-5 pt-10 mt-10 border-t border-gray-300 w-full max-w-xl text-gray-600'>
        <Link
          href='https://postgres-prisma.vercel.app/'
          className='font-medium underline underline-offset-4 hover:text-black transition-colors'
        >
          Prisma
        </Link>
        <Link
          href='https://postgres-starter.vercel.app/'
          className='font-medium underline underline-offset-4 hover:text-black transition-colors'
        >
          Starter
        </Link>
        <Link
          href='https://postgres-kysely.vercel.app/'
          className='font-medium underline underline-offset-4 hover:text-black transition-colors'
        >
          Kysely
        </Link>
      </div>

      <div className='sm:absolute sm:bottom-0 w-full px-20 py-10 flex justify-between'>
        <Link href='https://vercel.com'>
          <Image
            src='/vercel.svg'
            alt='Vercel Logo'
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href='https://github.com/vercel/examples/tree/main/storage/postgres-drizzle'
          className='flex items-center space-x-2'
        >
          <Image
            src='/github.svg'
            alt='GitHub Logo'
            width={24}
            height={24}
            priority
          />
          <p className='font-light'>Source</p>
        </Link>
      </div>
    </main>
  );
}
