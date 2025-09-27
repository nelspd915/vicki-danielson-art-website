import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Here you can:
        // 1. Mark the artwork as sold in Sanity
        // 2. Send confirmation email to customer
        // 3. Send notification email to artist
        // 4. Update inventory

        console.log("Payment successful:", {
          sessionId: session.id,
          artworkSlug: session.metadata?.artwork_slug,
          artworkTitle: session.metadata?.artwork_title,
          customerEmail: session.customer_details?.email,
          amount: session.amount_total
        });

        // Example: Update artwork status in Sanity
        // const { client } = await import('@/sanity/lib/client');
        // await client
        //   .patch(session.metadata?.artwork_slug)
        //   .set({ status: 'Sold' })
        //   .commit();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
