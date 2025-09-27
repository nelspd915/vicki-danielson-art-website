import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { galleryQuery } from "@/lib/queries";
import { formatPrice } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery - Vicki Danielson Art",
  description:
    "Browse the complete collection of original paintings and artwork by Vicki Danielson. Contemporary art available for purchase and commission."
};

// Type definition based on the Sanity schema
interface Artwork {
  _id: string;
  title: string;
  slug: string;
  images?: Array<{
    _type: "image";
    asset: {
      _ref: string;
    };
  }>;
  medium?: string;
  dimensions?: string;
  year?: number;
  price?: number;
  status?: "Available" | "Unavailable" | "Sold" | "Hidden";
  featured?: boolean;
}

export const revalidate = 60; // ISR: refresh every minute

export default async function GalleryPage() {
  const artworks = await client.fetch(galleryQuery);

  // Filter artworks: show all except hidden
  const visibleArtworks = artworks?.filter((art: Artwork) => art.status !== "Hidden") || [];

  // Sort artworks: featured first, then by creation date (newest first)
  const sortedArtworks = visibleArtworks.sort((a: Artwork, b: Artwork) => {
    // Featured artworks go to the top
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // If both are featured or both are not featured, sort by creation date (newest first)
    // Note: _createdAt is not in our current query, so we'll use a combination of year and _id as fallback
    if (a.year && b.year && a.year !== b.year) {
      return b.year - a.year; // Newer years first
    }

    // Fallback to _id comparison for consistent ordering
    return b._id.localeCompare(a._id);
  });

  // Calculate stats for display
  const availableCount = visibleArtworks.filter((art: Artwork) => art.status === "Available").length;
  const unavailableCount = visibleArtworks.filter((art: Artwork) => art.status === "Unavailable").length;
  const soldCount = visibleArtworks.filter((art: Artwork) => art.status === "Sold").length;

  // Total count includes hidden works
  const totalWorks = artworks?.length || 0;

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Complete Gallery</h1>
        <p className="text-lg theme-muted-text max-w-2xl mx-auto">
          Explore my complete collection of contemporary paintings. Each piece is an original work, created with passion
          and attention to detail.
        </p>

        {/* Stats */}
        <div className="mt-8">
          {/* Mobile: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 sm:hidden">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
              <div className="text-xs theme-muted-text uppercase tracking-wide">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{soldCount}</div>
              <div className="text-xs theme-muted-text uppercase tracking-wide">Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unavailableCount}</div>
              <div className="text-xs theme-muted-text uppercase tracking-wide">Unavailable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalWorks}</div>
              <div className="text-xs theme-muted-text uppercase tracking-wide">Total Works</div>
            </div>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden sm:flex justify-center gap-8 text-sm theme-muted-text">
            <span>{availableCount} Available</span>
            <span>•</span>
            <span>{unavailableCount} Unavailable</span>
            <span>•</span>
            <span>{soldCount} Sold</span>
            <span>•</span>
            <span>{totalWorks} Total Works</span>
          </div>
        </div>
      </div>

      {/* Consolidated Gallery */}
      {sortedArtworks.length > 0 ? (
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedArtworks.map((artwork: Artwork) => {
              const first = artwork.images?.[0];
              const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;

              // Determine status badge and styling
              const getStatusBadge = () => {
                switch (artwork.status) {
                  case "Available":
                    return (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        AVAILABLE
                      </span>
                    );
                  case "Unavailable":
                    return (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        UNAVAILABLE
                      </span>
                    );
                  case "Sold":
                    return (
                      <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">SOLD</span>
                    );
                  default:
                    return null;
                }
              };

              const getStatusMessage = () => {
                switch (artwork.status) {
                  case "Available":
                    return artwork.price != null ? formatPrice(artwork.price) : "Contact for pricing";
                  case "Unavailable":
                    return "Currently not available for purchase";
                  case "Sold":
                    return "This piece has found its forever home";
                  default:
                    return "";
                }
              };

              return (
                <Link
                  key={artwork._id}
                  href={`/art/${artwork.slug}`}
                  className="group rounded-2xl overflow-hidden theme-border border hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] theme-muted-bg">
                    {src && (
                      <Image
                        src={src}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                      />
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {getStatusBadge()}
                      {artwork.featured && (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {artwork.title}
                    </div>
                    <div className="text-sm theme-muted-text mb-3">
                      {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                    </div>
                    <div
                      className={`text-sm ${artwork.status === "Available" && artwork.price != null ? "text-lg font-semibold text-green-600" : "theme-muted-text"}`}
                    >
                      {getStatusMessage()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg theme-muted-text">No artworks to display</p>
        </div>
      )}

      {/* Empty State */}
      {artworks?.length === 0 && (
        <div className="text-center py-16">
          <div className="theme-muted-bg rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 theme-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Gallery Coming Soon</h3>
          <p className="theme-muted-text mb-6">
            New artworks are being added to the collection. Please check back soon!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Notified of New Works
          </Link>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center theme-muted-bg rounded-2xl p-8">
        <h3 className="text-2xl font-semibold mb-4">Interested in a Commission?</h3>
        <p className="theme-muted-text mb-6">
          I create custom artwork tailored to your vision and space. Let&apos;s discuss bringing your ideas to life.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Request a Commission
        </Link>
      </div>
    </main>
  );
}
