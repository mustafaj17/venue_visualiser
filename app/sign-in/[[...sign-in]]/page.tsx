import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className='min-h-screen flex items-center justify-center p-6'>
      <SignIn afterSignInUrl='/dashboard' afterSignUpUrl='/dashboard' />
    </main>
  );
}
