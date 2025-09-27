import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { galleryQuery, featuredQuery } from "@/lib/queries";
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
  featured?: boolean;
}

export const revalidate = 60; // ISR: refresh every minute

export default async function HomePage() {
  // Fetch both featured artworks and all artworks for stats
  const [featuredArtworks, allArtworks] = await Promise.all([client.fetch(featuredQuery), client.fetch(galleryQuery)]);

  // Use featured artworks if available, otherwise use first 6 from all artworks
  const displayArtworks = featuredArtworks?.length > 0 ? featuredArtworks : allArtworks?.slice(0, 6) || [];
  const availableCount = allArtworks?.filter((art: Artwork) => art.status === "Available")?.length || 0;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center theme-muted-bg">
        <div className="absolute inset-0 opacity-10">
          {displayArtworks[0]?.images?.[0] && (
            <Image
              src={urlFor(displayArtworks[0].images[0]).width(1920).height(1080).fit("crop").url()}
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
          <Link
            href="#gallery"
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Explore My Work
          </Link>
        </div>
      </section>

      {/* Featured Gallery - Main Focus */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {featuredArtworks?.length > 0 ? "Featured Gallery" : "Latest Gallery"}
          </h2>
          <p className="text-xl theme-muted-text max-w-3xl mx-auto">
            {featuredArtworks?.length > 0
              ? "My hand-picked selection of featured original paintings, each piece unique and ready to find its perfect home."
              : "A selection of my latest original paintings, each piece unique and ready to find its perfect home."}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayArtworks.map((artwork: Artwork) => {
            const first = artwork.images?.[0];
            const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
            return (
              <Link
                key={artwork._id}
                href={`/art/${artwork.slug}`}
                className="group rounded-2xl overflow-hidden theme-border border hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/5] theme-muted-bg">
                  {src && (
                    <Image
                      src={src}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={false}
                    />
                  )}
                  {artwork.status === "Sold" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-full font-semibold">SOLD</span>
                    </div>
                  )}
                  {artwork.featured && artwork.status !== "Sold" && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="font-semibold text-xl mb-3">{artwork.title}</div>
                  <div className="text-sm theme-muted-text mb-4">
                    {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                  </div>
                  {artwork.status === "Available" && artwork.price != null && (
                    <div className="text-xl font-bold text-green-600">{formatPrice(artwork.price)}</div>
                  )}
                  {artwork.status === "Sold" && (
                    <div className="text-sm theme-muted-text italic">This piece has found its home</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/gallery"
            className="inline-flex items-center bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
          >
            View Complete Gallery
            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="theme-muted-bg py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About the Artist</h2>
              <div className="space-y-4 theme-muted-text text-lg leading-relaxed">
                <p>
                  Based in the beautiful city of {siteConfig.contact.address.city}, {siteConfig.contact.address.state},
                  I create contemporary paintings that explore the intersection of emotion and nature.
                </p>
                <p>
                  Each piece is crafted with careful attention to color harmony and composition, using traditional
                  techniques combined with modern artistic vision to create works that speak to the soul and transform
                  any space.
                </p>
                <p>
                  My art is available for purchase and I also accept commission work for collectors seeking personalized
                  pieces that reflect their unique vision and space.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/contact"
                  className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Request Commission
                </Link>
                <Link
                  href={`mailto:${getContactEmail("general")}`}
                  className="theme-border border px-6 py-3 rounded-lg font-semibold theme-hover transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
            <div className="relative aspect-[3/4] theme-bg rounded-2xl overflow-hidden">
              {displayArtworks[1]?.images?.[0] && (
                <Image
                  src={urlFor(displayArtworks[1].images[0]).width(600).height(800).fit("crop").url()}
                  alt="Featured artwork"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
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
    </main>
  );
}
