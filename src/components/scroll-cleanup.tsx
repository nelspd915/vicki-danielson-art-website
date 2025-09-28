"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Clear scroll restoration data when navigating away from artwork detail pages
    if (pathname && pathname.startsWith("/art/")) {
      // We're on an artwork detail page - set up cleanup for when we leave
      const handleBeforeUnload = () => {
        // Clear the flag when leaving an artwork detail page
        sessionStorage.removeItem("navigatedFromArtwork");
      };

      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");

        if (link && !link.href.includes("/artwork")) {
          // Navigating from artwork detail page to anywhere other than artwork page
          sessionStorage.removeItem("navigatedFromArtwork");
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("click", handleLinkClick);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("click", handleLinkClick);
      };
    }
  }, [pathname]);

  return null;
}
