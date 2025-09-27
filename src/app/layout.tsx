import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Vicki Danielson Art",
  description: "Contemporary art gallery featuring original paintings and artwork"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen theme-bg theme-text`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Vicki Danielson Art
            </Link>
            <div className="flex items-center gap-4">
              <nav className="text-sm opacity-80">
                <Link href="/" className="hover:opacity-50">
                  Gallery
                </Link>
                <span className="mx-3 select-none cursor-default">·</span>
                <Link href="/studio" className="hover:opacity-50">
                  Studio
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
