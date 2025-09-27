import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.ARTIST_EMAIL) {
      console.error("Email configuration missing");
      return NextResponse.json({ error: "Email service temporarily unavailable" }, { status: 500 });
    }

    const transporter = createEmailTransporter();

    // Email to the artist (notification)
    const artistMailOptions = {
      from: `"Vicki Danielson Art Website" <${process.env.SMTP_USER}>`,
      to: process.env.ARTIST_EMAIL,
      subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h1>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #007cba; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #007cba;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; margin-top: 20px;">
            <p style="margin: 0;"><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      `
    };

    // Auto-reply email to the customer
    const customerMailOptions = {
      from: `"Vicki Danielson Art" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for reaching out!</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for contacting Vicki Danielson Art. I have received your message and appreciate your interest in my work.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>I typically respond to all inquiries within 24-48 hours during business days. If your inquiry is urgent, please don't hesitate to call me directly.</p>
          
          <p>In the meantime, feel free to browse my gallery for more beautiful artwork!</p>
          
          <p>Best regards,<br>
          Vicki Danielson</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    // Send both emails
    try {
      await Promise.all([transporter.sendMail(artistMailOptions), transporter.sendMail(customerMailOptions)]);

      console.log("✅ Contact form emails sent successfully");
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ Failed to send contact form emails:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
