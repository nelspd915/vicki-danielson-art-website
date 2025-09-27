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
      console.log("Creating checkout session for:", { title, price, slug });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, slug })
      });

      console.log("Checkout API response:", { status: res.status, ok: res.ok });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to create checkout session:", res.status, errorData);
        alert(`Failed to create checkout session: ${errorData.error || "Unknown error"}`);
        return;
      }

      const { url } = await res.json();
      console.log("Received checkout URL:", url);

      if (url) {
        console.log("Redirecting to Stripe checkout...");
        window.location.href = url;
      } else {
        console.error("No checkout URL returned");
        alert("No checkout URL returned from server");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(`Error: ${error}`);
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
