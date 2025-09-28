"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface HomepageData {
  navigationTitle?: string;
}

interface HeaderProps {
  homepageData: HomepageData | null;
}

export default function Header({ homepageData }: HeaderProps) {
  const navigationTitle = homepageData?.navigationTitle || siteConfig.name;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/artwork", label: "My Artwork" },
    { href: "/locations", label: "Locations" },
    { href: "/contact", label: "Contact" },
    { href: "/studio", label: "Studio" }
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b theme-border theme-bg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Title */}
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            {navigationTitle}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActiveLink(link.href) ? "text-blue-600 dark:text-blue-400" : "theme-muted-text hover:opacity-80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 theme-muted-text hover:opacity-80 transition-opacity"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t theme-border">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-3 text-base font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isActiveLink(link.href)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "theme-muted-text"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
