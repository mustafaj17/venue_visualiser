"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const OrganizationSwitcher = dynamic(
  async () => (await import("@clerk/nextjs")).OrganizationSwitcher,
  {
    ssr: false,
    loading: () => (
      <div className='h-8 w-40 rounded-md bg-gray-200 animate-pulse' />
    ),
  }
);

export default function Navbar() {
  return (
    <nav className='w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='mx-auto max-w-5xl px-6 h-14 flex items-center justify-between'>
        <Link href='/' className='font-medium tracking-tight'>
          Venue Visualiser
        </Link>
        <div className='flex items-center gap-3'>
          <SignedIn>
            <OrganizationSwitcher
              hidePersonal={false}
              afterSelectOrganizationUrl='/dashboard'
              afterLeaveOrganizationUrl='/dashboard'
            />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button className='rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 hover:bg-gray-900 transition'>
                Sign in
                <ArrowRight />
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
