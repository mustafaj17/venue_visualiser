"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

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
          <OrganizationSwitcher
            hidePersonal={false}
            afterSelectOrganizationUrl='/dashboard'
            afterLeaveOrganizationUrl='/dashboard'
          />
        </div>
      </div>
    </nav>
  );
}
