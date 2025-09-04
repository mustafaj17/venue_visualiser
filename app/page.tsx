import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center'>
        <div className='flex flex-col items-center text-center space-y-4 px-4'>
          <h1 className='text-3xl md:text-5xl font-bold text-gray-900'>
            Generate custom wedding venue images
          </h1>
          <p className='max-w-xl text-gray-600'>
            A platform to create AI-generated visualisations of wedding venues
            with customized decorations and styles.
          </p>
          <div>
            <Button
              asChild
              className='text-xl rounded-full bg-black text-white font-medium px-8 py-8 hover:bg-gray-900 transition'
            >
              <Link href='/dashboard'>
                Go to Dashboard
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
