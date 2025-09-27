import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

    // Verify the webhook secret if configured
    const authHeader = request.headers.get("authorization");
    if (webhookSecret) {
      // Try different authorization formats
      let providedSecret;

      if (authHeader?.startsWith("Bearer ")) {
        providedSecret = authHeader.replace("Bearer ", "");
      } else if (authHeader) {
        // Sometimes Sanity sends without "Bearer " prefix
        providedSecret = authHeader;
      }

      console.log("🔐 Checking webhook auth:", {
        hasSecret: !!webhookSecret,
        hasAuthHeader: !!authHeader,
        authHeaderFormat: authHeader?.substring(0, 10) + "...",
        secretsMatch: providedSecret === webhookSecret
      });

      if (!providedSecret || providedSecret !== webhookSecret) {
        console.log("❌ Unauthorized webhook request - secrets don't match");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      console.log("✅ Webhook authorized successfully");
    }

    const body = await request.json();
    console.log("🔄 Sanity webhook received:", {
      documentType: body._type,
      documentId: body._id,
      operation: body._rev ? "update" : "create"
    });

    // Revalidate specific paths based on document type
    switch (body._type) {
      case "artwork":
        console.log("🎨 Revalidating artwork pages...");
        // Revalidate homepage (featured artworks)
        revalidatePath("/");
        // Revalidate gallery page
        revalidatePath("/gallery");
        // Revalidate specific artwork page if slug exists
        if (body.slug?.current) {
          revalidatePath(`/art/${body.slug.current}`);
        }
        break;

      case "homepage":
        console.log("🏠 Revalidating homepage...");
        revalidatePath("/");
        break;

      default:
        console.log("📄 Revalidating all pages...");
        // For unknown document types, revalidate key pages
        revalidatePath("/");
        revalidatePath("/gallery");
        break;
    }

    return NextResponse.json({
      message: "Revalidation triggered successfully",
      documentType: body._type,
      paths: ["/", "/gallery", body.slug?.current ? `/art/${body.slug.current}` : null].filter(Boolean)
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
