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

  // Separate by status for different sections
  const availableArtworks = visibleArtworks.filter((art: Artwork) => art.status === "Available");
  const unavailableArtworks = visibleArtworks.filter((art: Artwork) => art.status === "Unavailable");
  const soldArtworks = visibleArtworks.filter((art: Artwork) => art.status === "Sold");

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
        <div className="flex justify-center gap-8 mt-8 text-sm theme-muted-text">
          <span>{availableArtworks.length} Available</span>
          <span>•</span>
          <span>{unavailableArtworks.length} Unavailable</span>
          <span>•</span>
          <span>{soldArtworks.length} Sold</span>
          <span>•</span>
          <span>{totalWorks} Total Works</span>
        </div>
      </div>

      {/* Available Artworks */}
      {availableArtworks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Available Works
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableArtworks.map((artwork: Artwork) => {
              const first = artwork.images?.[0];
              const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
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
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        AVAILABLE
                      </span>
                      {artwork.featured && (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-semibold text-lg mb-2">{artwork.title}</div>
                    <div className="text-sm theme-muted-text mb-3">
                      {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                    </div>
                    {artwork.price != null && (
                      <div className="text-lg font-semibold text-green-600">{formatPrice(artwork.price)}</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Unavailable Artworks */}
      {unavailableArtworks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
            Currently Unavailable
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unavailableArtworks.map((artwork: Artwork) => {
              const first = artwork.images?.[0];
              const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
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
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        UNAVAILABLE
                      </span>
                      {artwork.featured && (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-semibold text-lg mb-2">{artwork.title}</div>
                    <div className="text-sm theme-muted-text mb-3">
                      {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                    </div>
                    <div className="text-sm theme-muted-text">Currently not available for purchase</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Sold Artworks */}
      {soldArtworks.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
            Sold Works
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
            {soldArtworks.map((artwork: Artwork) => {
              const first = artwork.images?.[0];
              const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
              return (
                <div key={artwork._id} className="rounded-2xl overflow-hidden theme-border border">
                  <div className="relative aspect-[4/5] theme-muted-bg">
                    {src && (
                      <Image
                        src={src}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold">SOLD</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-semibold text-lg mb-2">{artwork.title}</div>
                    <div className="text-sm theme-muted-text mb-3">
                      {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                    </div>
                    <div className="text-sm theme-muted-text">This piece has found its forever home</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
