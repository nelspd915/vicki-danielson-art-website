import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil"
});

export async function POST(request: NextRequest) {
  try {
    const { title, price, slug } = await request.json();

    if (!title || !price || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if artwork is still available before creating checkout session
    const artwork = await client.fetch(`*[_type == "artwork" && slug.current == $slug][0]{ status }`, { slug });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    if (artwork.status !== "Available") {
      return NextResponse.json(
        {
          error: "This artwork is no longer available for purchase"
        },
        { status: 409 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: `Original artwork by Vicki Danielson`,
              metadata: {
                artwork_slug: slug
              }
            },
            unit_amount: Math.round(price * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/art/${slug}`,
      metadata: {
        artwork_slug: slug,
        artwork_title: title
      },
      // Optional: Configure shipping if needed
      shipping_address_collection: {
        allowed_countries: ["US", "CA"] // Adjust based on your shipping areas
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
