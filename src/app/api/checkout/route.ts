import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil"
});

export async function POST(request: NextRequest) {
  try {
    const { title, price, slug } = await request.json();

    console.log("Checkout request received:", { title, price, slug });
    console.log("Environment check:", {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });

    if (!title || !price || !slug) {
      console.error("Missing required fields:", { title: !!title, price: !!price, slug: !!slug });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    console.log("Stripe session created successfully:", {
      sessionId: session.id,
      url: session.url
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout session"
      },
      { status: 500 }
    );
  }
}
