import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management App",
  description: "A simple inventory management app built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full border-b border-zinc-200 py-4 mb-8 bg-background text-foreground shadow-sm">
          <nav className="mx-auto w-full max-w-7xl px-4 h-4 flex items-center justify-between">
            <Link href="/" className="font-semibold">TaskHub</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/products" className="hover:underline">Products</Link>
              <Link href="/warehouse" className="hover:underline">Warehouse</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </div>
          </nav>
        </header>
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          {children}
        </main>
      </body>
    </html>
  );
}
