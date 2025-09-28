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
        // Only restore if we actually came directly from an artwork detail page
        const navigatedFromArtwork = sessionStorage.getItem("navigatedFromArtwork");
        const savedPosition = sessionStorage.getItem("artworkScrollPosition");

        if (navigatedFromArtwork === "true" && savedPosition) {
          const position = parseInt(savedPosition, 10);
          // Use requestAnimationFrame to ensure DOM is fully rendered
          requestAnimationFrame(() => {
            window.scrollTo({
              top: position,
              behavior: "auto" // Instant scroll, not smooth
            });
          });
        }

        // Always clear the navigation flag after checking
        sessionStorage.removeItem("navigatedFromArtwork");
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

      if (link && window.location.pathname === "/artwork") {
        if (link.href.includes("/art/")) {
          // Navigating to artwork detail page - save position and set flag
          saveScrollPosition();
          sessionStorage.setItem("navigatedFromArtwork", "true");
        }
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      if (window.location.pathname === "/artwork") {
        // Small delay to ensure the page has rendered
        setTimeout(restoreScrollPosition, 50);
      }
    };

    // Handle initial page load
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
