import Navbar from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotAuthorizedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-8 flex flex-col items-start mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Not authorized
        </h1>
        <p className="mt-3 text-base text-gray-600">
          You do not have permission to view this page.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button
            asChild
            variant="cta"
            rounded="full"
            size="default"
            className="text-sm font-medium"
          >
            <Link href="/sign-in">
              Sign in
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            rounded="full"
            size="default"
            className="text-sm font-medium"
          >
            <Link href="/sign-up">
              Sign up
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
