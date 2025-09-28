import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Vicki Danielson Art",
  description: "The page you are looking for could not be found."
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 theme-bg">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Number */}
        <div>
          <h1 className="text-9xl font-bold theme-text opacity-20">404</h1>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold theme-text">Oops! Page Not Found</h2>
          <p className="text-lg theme-muted-text max-w-sm mx-auto">
            The page you&apos;re looking for seems to have wandered off like a brushstroke on the wrong canvas.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>

            <Link
              href="/artwork"
              className="inline-flex items-center justify-center px-6 py-3 border theme-border text-base font-medium rounded-lg theme-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View My Artwork
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm theme-muted-text hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Or get in touch
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center space-x-2 opacity-30">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
