import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { galleryQuery } from "@/lib/queries";

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
  status?: "Available" | "Reserved" | "Sold";
}

export const revalidate = 60; // ISR: refresh every minute

export default async function HomePage() {
  const artworks = await client.fetch(galleryQuery);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-semibold mb-6">Gallery</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks?.map((artwork: Artwork) => {
          const first = artwork.images?.[0];
          const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
          return (
            <Link key={artwork._id} href={`/art/${artwork.slug}`} className="group rounded-2xl overflow-hidden border">
              <div className="relative aspect-[4/5] bg-black/5">
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
              </div>
              <div className="p-4">
                <div className="font-medium">{artwork.title}</div>
                <div className="text-sm opacity-70">
                  {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                </div>
                {artwork.status === "Available" && artwork.price != null && (
                  <div className="mt-2 text-sm">From ${artwork.price}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
