"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig, getContactEmail } from "@/lib/config";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. I'll get back to you within 24-48 hours."
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again."
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-lg theme-muted-text">
          I&apos;d love to hear from you! Get in touch with any questions about my artwork, commissions, or general
          inquiries.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="theme-card-bg p-6 rounded-lg theme-border border">
          <h2 className="text-2xl font-semibold mb-6">Send a message</h2>

          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 theme-border border rounded-lg theme-bg theme-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 theme-border border rounded-lg theme-bg theme-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 theme-border border rounded-lg theme-bg theme-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="artwork">About an Artwork</option>
                <option value="commission">Commission Request</option>
                <option value="purchase">Purchase Support</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                rows={5}
                className="w-full px-4 py-2 theme-border border rounded-lg theme-bg theme-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical disabled:opacity-50"
                placeholder="How can I help you..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="theme-card-bg p-6 rounded-lg theme-border border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </h3>
            <p className="theme-muted-text mb-2">For general inquiries:</p>
            <Link
              href={`mailto:${getContactEmail("general")}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {getContactEmail("general")}
            </Link>

            <p className="theme-muted-text mb-2 mt-4">For commission requests:</p>
            <Link
              href={`mailto:${getContactEmail("commission")}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {getContactEmail("commission")}
            </Link>
          </div>

          <div className="theme-card-bg p-6 rounded-lg theme-border border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Response Time
            </h3>
            <p className="theme-muted-text">
              Typical response time for all inquiries is {siteConfig.business.responseTime}.
            </p>
          </div>

          <div className="theme-card-bg p-6 rounded-lg theme-border border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              FAQ
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Do you accept commissions?</p>
                <p className="theme-muted-text text-sm">Yes! Please use the commission inquiry option above.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
