import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Contact Us - ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name} for inquiries about artwork, commissions, and more.`
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
