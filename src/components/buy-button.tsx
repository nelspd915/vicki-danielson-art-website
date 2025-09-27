"use client";

import { formatPriceExact } from "@/lib/config";
import { useState } from "react";

interface BuyButtonProps {
  title: string;
  price: number;
  slug: string;
}

export default function BuyButton({ title, price, slug }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, slug })
      });

      if (!res.ok) {
        console.error("Failed to create checkout session");
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePurchase}
      disabled={isLoading}
      className="mt-6 rounded-lg theme-border border px-6 py-3 theme-hover transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Processing..." : `Buy Now - ${formatPriceExact(price)}`}
    </button>
  );
}
