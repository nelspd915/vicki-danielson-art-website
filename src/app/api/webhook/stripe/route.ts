import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send confirmation email to customer
async function sendCustomerConfirmation(session: Stripe.Checkout.Session) {
  if (!session.customer_details?.email || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log("Skipping customer email - missing email config or customer email");
    return;
  }

  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Vicki Danielson Art" <${process.env.SMTP_USER}>`,
    to: session.customer_details.email,
    subject: "Thank you for your purchase!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank you for your purchase!</h1>
        <p>Dear ${session.customer_details.name || "Art Lover"},</p>
        
        <p>We're thrilled to confirm your purchase of <strong>"${session.metadata?.artwork_title}"</strong> by Vicki Danielson.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Artwork:</strong> ${session.metadata?.artwork_title}</p>
          <p><strong>Amount:</strong> $${(session.amount_total || 0) / 100}</p>
          <p><strong>Order ID:</strong> ${session.id}</p>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Your artwork will be carefully packaged and prepared for shipping</li>
          <li>We'll send you tracking information once it's dispatched</li>
          <li>You can expect delivery within 5-10 business days</li>
        </ul>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Thank you for supporting original art!</p>
        <p>Best regards,<br>The Vicki Danielson Art Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Customer confirmation email sent successfully");
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
  }
}

// Send notification email to artist
async function sendArtistNotification(session: Stripe.Checkout.Session) {
  if (!process.env.ARTIST_EMAIL || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log("Skipping artist notification - missing email config");
    return;
  }

  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Vicki Danielson Art Website" <${process.env.SMTP_USER}>`,
    to: process.env.ARTIST_EMAIL,
    subject: "🎉 New Artwork Sale!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">🎉 Congratulations! You have a new sale!</h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Sale Details:</h3>
          <p><strong>Artwork:</strong> ${session.metadata?.artwork_title}</p>
          <p><strong>Amount:</strong> $${(session.amount_total || 0) / 100}</p>
          <p><strong>Customer:</strong> ${session.customer_details?.name || "Name not provided"}</p>
          <p><strong>Email:</strong> ${session.customer_details?.email}</p>
          <p><strong>Order ID:</strong> ${session.id}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h4>Next Steps:</h4>
          <ul>
            <li>The artwork has been automatically marked as "Sold" in your CMS</li>
            <li>Customer will receive a confirmation email</li>
            <li>Please prepare the artwork for shipping</li>
            <li>Update the customer with tracking information when shipped</li>
          </ul>
        </div>
        
        <p>Keep creating amazing art! 🎨</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Artist notification email sent successfully");
  } catch (error) {
    console.error("Failed to send artist notification email:", error);
  }
}

// Update artwork status in Sanity
async function updateArtworkStatus(artworkSlug: string) {
  if (!process.env.SANITY_API_TOKEN) {
    console.log("⚠️ Skipping Sanity update - missing SANITY_API_TOKEN");
    return;
  }

  try {
    // Create a write client for mutations
    const writeClient = client.withConfig({
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });

    // Find the artwork document by slug
    const artwork = await client.fetch(`*[_type=="artwork" && slug.current == $slug][0]{ _id }`, { slug: artworkSlug });

    if (!artwork) {
      console.error("❌ Artwork not found:", artworkSlug);
      return;
    }

    console.log("📝 Updating artwork status for:", artworkSlug, "ID:", artwork._id);

    // Update the artwork status to "Sold"
    const result = await writeClient
      .patch(artwork._id)
      .set({
        status: "Sold",
        soldAt: new Date().toISOString()
      })
      .commit();

    console.log("✅ Artwork status updated to 'Sold':", result);
  } catch (error) {
    console.error("❌ Failed to update artwork status:", error);
  }
}

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

        console.log("🎉 Payment successful:", {
          sessionId: session.id,
          artworkSlug: session.metadata?.artwork_slug,
          artworkTitle: session.metadata?.artwork_title,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          amount: `$${(session.amount_total || 0) / 100}`
        });

        // Execute post-payment actions
        const promises = [];

        // 1. Mark artwork as sold in Sanity
        if (session.metadata?.artwork_slug) {
          promises.push(updateArtworkStatus(session.metadata.artwork_slug));
        }

        // 2. Send confirmation email to customer
        promises.push(sendCustomerConfirmation(session));

        // 3. Send notification email to artist
        promises.push(sendArtistNotification(session));

        // Execute all promises concurrently
        await Promise.allSettled(promises);

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ Payment failed:", paymentIntent.id);
        break;
      }

      case "charge.succeeded":
      case "charge.updated":
      case "payment_intent.succeeded":
      case "payment_intent.created": {
        // These events are expected but don't require action
        console.log(`✓ Received ${event.type} event (no action needed)`);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
