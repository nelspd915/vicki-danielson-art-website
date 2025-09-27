import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";

interface HomepageData {
  navigationTitle?: string;
}

interface HeaderProps {
  homepageData: HomepageData | null;
}

export default function Header({ homepageData }: HeaderProps) {
  const navigationTitle = homepageData?.navigationTitle || siteConfig.name;

  return (
    <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold">
        {navigationTitle}
      </Link>
      <div className="flex items-center gap-4">
        <nav className="text-sm opacity-80">
          <Link href="/" className="hover:opacity-50">
            Home
          </Link>
          <span className="mx-3 select-none cursor-default">·</span>
          <Link href="/gallery" className="hover:opacity-50">
            Gallery
          </Link>
          <span className="mx-3 select-none cursor-default">·</span>
          <Link href="/contact" className="hover:opacity-50">
            Contact
          </Link>
          <span className="mx-3 select-none cursor-default">·</span>
          <Link href="/studio" className="hover:opacity-50">
            Studio
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
