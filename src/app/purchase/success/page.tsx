import { Suspense } from "react";
import Link from "next/link";

interface SearchParamsProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function SuccessContent({ sessionId }: { sessionId: string | undefined }) {
  if (!sessionId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Invalid Session</h1>
        <p className="mb-6">No valid session ID found.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 theme-card-bg theme-card-text theme-border border rounded-lg theme-hover transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-green-600 mb-4">Purchase Successful!</h1>
        <p className="text-lg theme-muted-text mb-6">
          Thank you for your purchase! You will receive a confirmation email shortly.
        </p>
        <div className="theme-muted-bg rounded-lg p-4 mb-6">
          <p className="text-sm theme-muted-text">
            <strong>Session ID:</strong> {sessionId}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="theme-muted-text">
          <p className="mb-2">What happens next?</p>
          <ul className="text-sm space-y-1">
            <li>• You&apos;ll receive an email confirmation</li>
            <li>• The artwork will be carefully packaged</li>
            <li>• We&apos;ll send you tracking information once shipped</li>
          </ul>
        </div>

        <div className="pt-6 space-x-4">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-all shadow-md"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 theme-border border theme-muted-text rounded-lg theme-hover transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function PurchaseSuccessPage({ searchParams }: SearchParamsProps) {
  const { session_id } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl p-6 min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent sessionId={session_id} />
      </Suspense>
    </main>
  );
}
