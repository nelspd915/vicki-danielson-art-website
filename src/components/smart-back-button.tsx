"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SmartBackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if user came from the artwork page by checking session storage
    const cameFromArtwork = sessionStorage.getItem("artworkScrollPosition") !== null;
    setCanGoBack(cameFromArtwork && window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/artwork");
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleBack}
        className="inline-flex items-center text-sm theme-muted-text hover:opacity-80 transition-opacity group cursor-pointer"
      >
        <svg
          className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Artwork
      </button>
    </div>
  );
}
