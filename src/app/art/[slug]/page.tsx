import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { artworkBySlugQuery } from "@/lib/queries";

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
    <main className="mx-auto max-w-5xl p-6 grid gap-6 lg:grid-cols-2">
      <div className="relative aspect-[4/5] bg-black/5 rounded-2xl overflow-hidden">
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
        <div className="mt-2 opacity-70">
          {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
        </div>
        {artwork.status === "Available" && artwork.price != null && (
          <div className="mt-4 text-lg">Price: ${artwork.price}</div>
        )}
        {artwork.status !== "Available" && <div className="mt-4 text-lg">{artwork.status}</div>}
        {/* Replace with a Buy or Inquire button later */}
      </div>
    </main>
  );
}
