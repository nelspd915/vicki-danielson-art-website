import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { featuredQuery, homepageQuery } from "@/lib/queries";
import { formatPrice, getContactEmail } from "@/lib/config";
import ScrollAnimations from "@/components/scroll-animations";
import ScrollButton from "@/components/scroll-button";

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

interface HomepageContent {
  _id: string;
  navigationTitle: string;
  siteTitle: string;
  siteDescription: string;
  featuredGalleryText: string;
  aboutTitle: string;
  aboutText?: Array<{
    _type: "block";
    children: Array<{
      text: string;
    }>;
  }>;
  profileImage?: {
    _type: "image";
    asset: {
      _ref: string;
    };
    alt?: string;
  };
}

// Helper function to render Sanity block content as plain text
const renderBlockText = (blocks: HomepageContent["aboutText"]) => {
  if (!blocks || blocks.length === 0) return null;

  return blocks
    .map((block, index) => {
      if (block._type === "block" && block.children) {
        const text = block.children.map((child) => child.text).join("");
        return (
          <p key={index} className="mb-4">
            {text}
          </p>
        );
      }
      return null;
    })
    .filter(Boolean);
};

export default async function HomePage() {
  // Fetch data server-side - no more flashing!
  const [featuredArtworks, homepageContent] = await Promise.all([
    client.fetch(featuredQuery),
    client.fetch(homepageQuery)
  ]);

  // Fallback values if no homepage content is configured
  const content: HomepageContent = homepageContent || {
    _id: "fallback",
    navigationTitle: "Vicki Danielson Art",
    siteTitle: "Vicki Danielson Art",
    siteDescription:
      "Contemporary paintings capturing the essence of emotion and nature through bold colors and expressive brushwork",
    featuredGalleryText:
      "My hand-picked selection of featured original paintings, each piece unique and ready to find its perfect home.",
    aboutTitle: "Meet the Artist"
  };

  return (
    <>
      <ScrollAnimations />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center theme-muted-bg scroll-animate">
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6">{content.siteTitle}</h1>
            <p className="text-xl md:text-2xl theme-muted-text mb-8 max-w-2xl mx-auto">{content.siteDescription}</p>
            <ScrollButton />
          </div>
        </section>

        {/* Featured Gallery - Main Focus */}
        <section id="gallery" className="max-w-7xl mx-auto px-6 py-20 scroll-animate">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Gallery</h2>
            <p className="text-xl theme-muted-text max-w-3xl mx-auto">{content.featuredGalleryText}</p>
          </div>

          {featuredArtworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl theme-muted-text mb-4">No featured artworks found</p>
              <p className="text-sm theme-muted-text">
                Configure featured artworks in Sanity CMS to display them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArtworks.map((artwork: Artwork, index: number) => {
                const first = artwork.images?.[0];
                const src = first ? urlFor(first).width(1200).height(1500).fit("crop").url() : undefined;
                return (
                  <div key={artwork._id} className="scroll-animate" style={{ transitionDelay: `${index * 100}ms` }}>
                    <Link
                      href={`/art/${artwork.slug}`}
                      className="group rounded-2xl overflow-hidden theme-border border hover:shadow-xl transition-all duration-500 block hover-lift"
                    >
                      <div className="relative aspect-[4/5] theme-muted-bg">
                        {src && (
                          <Image
                            src={src}
                            alt={artwork.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority={false}
                          />
                        )}
                        {artwork.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse-subtle">
                              FEATURED
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          {artwork.status === "Available" && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              AVAILABLE
                            </span>
                          )}
                          {artwork.status === "Sold" && (
                            <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              SOLD
                            </span>
                          )}
                          {artwork.status === "Unavailable" && (
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              UNAVAILABLE
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="font-semibold text-xl mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {artwork.title}
                        </div>
                        <div className="text-sm theme-muted-text mb-4">
                          {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
                        </div>
                        {artwork.status === "Available" && artwork.price != null && (
                          <div className="text-xl font-bold text-green-600">{formatPrice(artwork.price)}</div>
                        )}
                        {artwork.status === "Available" && artwork.price == null && (
                          <div className="text-sm theme-muted-text">Contact for pricing</div>
                        )}
                        {artwork.status === "Sold" && (
                          <div className="text-sm theme-muted-text italic">This piece has found its home</div>
                        )}
                        {artwork.status === "Unavailable" && (
                          <div className="text-sm theme-muted-text">Currently not available for purchase</div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16 scroll-animate">
            <Link
              href="/gallery"
              className="inline-flex items-center bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 text-lg hover:scale-105 group"
            >
              View Complete Gallery
              <svg
                className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="theme-muted-bg py-20 scroll-animate">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="scroll-animate">
                <h2 className="text-3xl font-bold mb-6">{content.aboutTitle}</h2>
                <div className="space-y-4 theme-muted-text text-lg leading-relaxed">
                  {content.aboutText && content.aboutText.length > 0 ? (
                    renderBlockText(content.aboutText)
                  ) : (
                    <p className="mb-4">
                      Welcome to my artistic journey. Each painting I create is a window into emotion, capturing the
                      interplay between light, color, and feeling. My work draws inspiration from nature&apos;s beauty
                      and the human experience, transformed through bold brushwork and vibrant palettes.
                    </p>
                  )}
                </div>
                <div className="mt-8 flex gap-4">
                  <Link
                    href="/contact"
                    className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                  >
                    Request Commission
                  </Link>
                  <Link
                    href={`mailto:${getContactEmail("general")}`}
                    className="theme-border border px-6 py-3 rounded-lg font-semibold theme-hover transition-all duration-300 hover:scale-105"
                  >
                    Get In Touch
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[3/4] theme-bg rounded-2xl overflow-hidden scroll-animate hover-lift">
                {/* Artist Profile Picture */}
                {content.profileImage ? (
                  <Image
                    src={urlFor(content.profileImage).width(600).height(800).fit("crop").url()}
                    alt={content.profileImage.alt || "Artist Profile Photo"}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Vicki Danielson</h3>
                      <p className="text-sm theme-muted-text">Contemporary Artist</p>
                      <p className="text-xs theme-muted-text mt-2 opacity-60">Add profile photo in Sanity CMS</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
