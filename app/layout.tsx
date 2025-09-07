import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://postgres-drizzle.vercel.app"),
  title: "Postgres Demo with Drizzle",
  description:
    "A simple Next.js app with a Postgres database and Drizzle as the ORM",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.variable}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
