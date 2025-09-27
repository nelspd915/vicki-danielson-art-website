import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/config";
import { client } from "@/sanity/lib/client";
import { homepageQuery } from "@/lib/queries";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

// Generate dynamic metadata from homepage configuration
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homepage = await client.fetch(homepageQuery);

    return {
      title: homepage?.navigationTitle || siteConfig.name,
      description: homepage?.siteDescription || siteConfig.description
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: siteConfig.name,
      description: siteConfig.description
    };
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch homepage data for header
  let homepageData = null;
  try {
    homepageData = await client.fetch(homepageQuery);
  } catch (error) {
    console.error("Error fetching homepage data for header:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen theme-bg theme-text`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <Header homepageData={homepageData} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
