import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ArrowRight, Sparkles, Image as ImageIcon, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Navbar />
        <main className='relative flex-1'>
          {/* Background gradient and decorative blur */}
          <div className='pointer-events-none absolute inset-0 -z-10'>
            <div className='absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50' />
            <div className='absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-300/40 via-purple-300/40 to-indigo-300/40 blur-3xl' />
          </div>

          {/* Hero */}
          <section className='mx-auto max-w-5xl px-6 pt-16 pb-12 text-center'>
            <div className='inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-gray-700 backdrop-blur'>
              <Sparkles className='h-3.5 w-3.5' />
              <span>New: Smarter scene styling</span>
            </div>
            <h1 className='mt-5 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl'>
              Design your perfect wedding venue with AI
            </h1>
            <p className='mx-auto mt-4 max-w-2xl text-gray-600'>
              Upload a photo, choose a theme, and instantly visualise
              breathtaking decorations, lighting, and table setups tailored to
              your vision.
            </p>
            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <Button asChild className='rounded-full px-6 py-6 text-base'>
                <Link href='/dashboard'>
                  Get started
                  <ArrowRight className='ml-1.5 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </section>

          {/* Features */}
          <section className='mx-auto max-w-5xl px-6 pb-20'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-xl border bg-white p-6 shadow-sm'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white'>
                  <ImageIcon className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-semibold'>Upload your venue</h3>
                <p className='mt-1 text-sm text-gray-600'>
                  Start with a real photo of your space for accurate perspective
                  and lighting.
                </p>
              </div>
              <div className='rounded-xl border bg-white p-6 shadow-sm'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white'>
                  <Wand2 className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-semibold'>Style with prompts</h3>
                <p className='mt-1 text-sm text-gray-600'>
                  Describe decor, florals, and ambience. We generate realistic
                  variations in seconds.
                </p>
              </div>
              <div className='rounded-xl border bg-white p-6 shadow-sm'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white'>
                  <Sparkles className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-semibold'>Plan with confidence</h3>
                <p className='mt-1 text-sm text-gray-600'>
                  Share visuals with clients and vendors and iterate on details
                  together.
                </p>
              </div>
            </div>
          </section>
        </main>
        {/* Footer */}
        <footer className='border-t bg-white/60 backdrop-blur'>
          <div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-6 text-sm text-gray-600'>
            <span>© {new Date().getFullYear()} Venue Visualiser</span>
            <div className='flex gap-4'>
              <Link href='/sign-in' className='hover:text-gray-900'>
                Login
              </Link>
              <Link href='/dashboard' className='hover:text-gray-900'>
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
