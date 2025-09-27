import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { galleryQuery } from "@/lib/queries";
import { siteConfig, formatPrice, getContactEmail } from "@/lib/config";

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

  // Get featured artworks (first 6 available pieces)
  const featuredArtworks = artworks?.slice(0, 6) || [];
  const availableCount = artworks?.filter((art: Artwork) => art.status === "Available")?.length || 0;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center theme-muted-bg">
        <div className="absolute inset-0 opacity-10">
          {featuredArtworks[0]?.images?.[0] && (
            <Image
              src={urlFor(featuredArtworks[0].images[0]).width(1920).height(1080).fit("crop").url()}
              alt=""
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{siteConfig.name}</h1>
          <p className="text-xl md:text-2xl theme-muted-text mb-8 max-w-2xl mx-auto">
            Contemporary paintings capturing the essence of emotion and nature through bold colors and expressive
            brushwork
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#gallery"
              className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Gallery
            </Link>
            <Link
              href="/contact"
              className="theme-border border px-8 py-4 rounded-lg font-semibold theme-hover transition-colors"
            >
              Commission Art
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About the Artist</h2>
            <div className="space-y-4 theme-muted-text text-lg leading-relaxed">
              <p>
                Based in the beautiful city of {siteConfig.contact.address.city}, {siteConfig.contact.address.state}, I
                create contemporary paintings that explore the intersection of emotion and nature.
              </p>
              <p>
                Each piece is crafted with careful attention to color harmony and composition, using traditional
                techniques combined with modern artistic vision to create works that speak to the soul and transform any
                space.
              </p>
              <p>
                My art is available for purchase and I also accept commission work for collectors seeking personalized
                pieces that reflect their unique vision and space.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Learn More About Commissions →
              </Link>
            </div>
          </div>
          <div className="relative aspect-[3/4] theme-muted-bg rounded-2xl overflow-hidden">
            {featuredArtworks[1]?.images?.[0] && (
              <Image
                src={urlFor(featuredArtworks[1].images[0]).width(600).height(800).fit("crop").url()}
                alt="Artist at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="theme-muted-bg py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">{availableCount}+</div>
              <div className="theme-muted-text">Available Works</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10+</div>
              <div className="theme-muted-text">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="theme-muted-text">Happy Collectors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{siteConfig.business.shippingRegions.length}</div>
              <div className="theme-muted-text">Countries Shipped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Gallery</h2>
          <p className="text-lg theme-muted-text max-w-2xl mx-auto">
            Discover a curated selection of available original paintings, each piece unique and ready to find its
            perfect home.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtworks.map((artwork: Artwork) => {
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
                  {artwork.status === "Sold" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-full font-semibold">SOLD</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="font-semibold text-lg mb-2">{artwork.title}</div>
                  <div className="text-sm theme-muted-text mb-3">
                    {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                  </div>
                  {artwork.status === "Available" && artwork.price != null && (
                    <div className="text-lg font-semibold">{formatPrice(artwork.price)}</div>
                  )}
                  {artwork.status === "Sold" && (
                    <div className="text-sm theme-muted-text">This piece has found its home</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/gallery"
            className="inline-flex items-center theme-border border px-8 py-4 rounded-lg font-semibold theme-hover transition-colors"
          >
            View Complete Gallery
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="theme-muted-bg py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Bring Art Into Your Life</h2>
          <p className="text-lg theme-muted-text mb-8">
            Whether you&apos;re looking for the perfect piece to complete your collection or interested in a custom
            commission, I&apos;d love to help you find art that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`mailto:${getContactEmail("general")}`}
              className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get In Touch
            </Link>
            <Link
              href="/contact"
              className="theme-border border px-8 py-4 rounded-lg font-semibold theme-hover transition-colors"
            >
              Request Commission
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
