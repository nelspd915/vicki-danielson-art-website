"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    let scrollPosition = 0;

    const saveScrollPosition = () => {
      if (typeof window !== "undefined" && window.location.pathname === "/artwork") {
        scrollPosition = window.scrollY;
        sessionStorage.setItem("artworkScrollPosition", scrollPosition.toString());
      }
    };

    const restoreScrollPosition = () => {
      if (typeof window !== "undefined" && window.location.pathname === "/artwork") {
        const savedPosition = sessionStorage.getItem("artworkScrollPosition");
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          // Use requestAnimationFrame to ensure DOM is fully rendered
          requestAnimationFrame(() => {
            window.scrollTo({
              top: position,
              behavior: "auto" // Instant scroll, not smooth
            });
          });
        }
      }
    };

    // Save position before leaving the page
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // Handle clicking on artwork links
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href.includes("/art/") && window.location.pathname === "/artwork") {
        saveScrollPosition();
      }
    };

    // Handle browser back/forward buttons and initial page load
    const handlePopState = () => {
      if (window.location.pathname === "/artwork") {
        // Small delay to ensure the page has rendered
        setTimeout(restoreScrollPosition, 50);
      }
    };

    // Restore position on initial load (for when coming back from artwork page)
    const handleLoad = () => {
      if (window.location.pathname === "/artwork") {
        restoreScrollPosition();
      }
    };

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick);

    // Check if we need to restore position immediately
    handleLoad();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  return null; // This component doesn't render anything
}
