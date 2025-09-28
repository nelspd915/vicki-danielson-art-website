import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { artworkBySlugQuery } from "@/lib/queries";
import BuyButton from "@/components/buy-button";

// Type for slug data from Sanity
interface SlugItem {
  slug: string;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const items: SlugItem[] = await client.fetch(`*[_type=="artwork" && defined(slug.current)]{ "slug": slug.current }`);
  return items.map((item) => ({ slug: item.slug }));
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artwork = await client.fetch(artworkBySlugQuery, { slug });
  if (!artwork) return <div className="p-6">Not found.</div>;

  const first = artwork.images?.[0];
  const src = first ? urlFor(first).width(1600).height(2000).fit("crop").url() : undefined;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Back to My Artwork Navigation */}
      <div className="mb-6">
        <Link
          href="/artwork"
          className="inline-flex items-center text-sm theme-muted-text hover:opacity-80 transition-opacity group"
        >
          <svg
            className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Artwork
        </Link>
      </div>

      {/* Main Content */}
      <main className="grid gap-6 lg:grid-cols-2">
        <div className="relative aspect-[4/5] theme-muted-bg rounded-2xl overflow-hidden">
          {src && (
            <Image
              src={src}
              alt={artwork.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{artwork.title}</h1>
          <div className="mt-2 theme-muted-text">
            {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
          </div>
          {artwork.status === "Sold" && (
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-600 mb-2">This piece has been sold</div>
              <div className="text-sm theme-muted-text">This artwork has found its forever home with a collector.</div>
            </div>
          )}
          {artwork.status === "Unavailable" && (
            <div className="mt-4">
              <div className="text-lg font-semibold text-orange-600 mb-2">Currently Unavailable</div>
              <div className="text-sm theme-muted-text">This piece is temporarily not available for purchase.</div>
            </div>
          )}
          {artwork.status === "Hidden" && (
            <div className="mt-4">
              <div className="text-lg font-semibold theme-muted-text">Private Collection</div>
            </div>
          )}
          {artwork.status === "Available" && artwork.price != null && (
            <BuyButton title={artwork.title} price={artwork.price} slug={slug} />
          )}
        </div>
      </main>
    </div>
  );
}
