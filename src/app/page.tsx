"use client";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { galleryQuery, featuredQuery, artistProfileQuery } from "@/lib/queries";
import { siteConfig, formatPrice, getContactEmail } from "@/lib/config";
import { useEffect, useState } from "react";

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

interface Artist {
  _id: string;
  profileImage?: {
    _type: "image";
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  bio?: Array<{
    _type: "block";
    children: Array<{
      text: string;
    }>;
  }>;
}

// Helper function to render Sanity block content as plain text
const renderBlockText = (blocks: Artist["bio"]) => {
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

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};

// Intersection Observer hook for scroll animations
const useScrollAnimation = () => {
  useEffect(() => {
    // Add animate-on-scroll class to all scroll-animate elements initially
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => {
      // Only add the hidden state to elements that aren't in the initial viewport
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.8) {
        el.classList.add("animate-on-scroll");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animate-on-scroll");
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all elements with the scroll-animate class
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default function HomePage() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [artistProfile, setArtistProfile] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  // Use scroll animation hook
  useScrollAnimation();

  useEffect(() => {
    const fetchArtworks = async () => {
      console.log("Fetching artworks...");
      try {
        const [featured, all, artist] = await Promise.all([
          client.fetch(featuredQuery),
          client.fetch(galleryQuery),
          client.fetch(artistProfileQuery)
        ]);
        console.log("Featured artworks:", featured);
        console.log("All artworks:", all);
        console.log("Artist profile:", artist);
        setFeaturedArtworks(featured || []);
        setAllArtworks(all || []);
        setArtistProfile(artist);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Use featured artworks if available, otherwise use first 6 from all artworks
  const displayArtworks = featuredArtworks?.length > 0 ? featuredArtworks : allArtworks?.slice(0, 6) || [];
  const availableCount = allArtworks?.filter((art: Artwork) => art.status === "Available")?.length || 0;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center theme-muted-bg scroll-animate">
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
          <button
            onClick={() => smoothScrollTo("gallery")}
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 group"
          >
            <span className="inline-flex items-center">
              Explore My Work
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* Featured Gallery - Main Focus */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-20 scroll-animate">
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

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] skeleton"></div>
                <div className="p-6">
                  <div className="h-6 skeleton rounded mb-3"></div>
                  <div className="h-4 skeleton rounded mb-4 w-3/4"></div>
                  <div className="h-6 skeleton rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayArtworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl theme-muted-text mb-4">No artworks found</p>
            <p className="text-sm theme-muted-text">
              Featured: {featuredArtworks.length}, All: {allArtworks.length}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayArtworks.map((artwork: Artwork, index: number) => {
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
                      {artwork.status === "Sold" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-black px-4 py-2 rounded-full font-semibold">SOLD</span>
                        </div>
                      )}
                      {artwork.status === "Unavailable" && (
                        <div className="absolute inset-0 bg-orange-600 bg-opacity-60 flex items-center justify-center">
                          <span className="bg-white text-black px-4 py-2 rounded-full font-semibold">UNAVAILABLE</span>
                        </div>
                      )}
                      {artwork.featured && artwork.status !== "Sold" && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse-subtle">
                            FEATURED
                          </span>
                        </div>
                      )}
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
                      {artwork.status === "Sold" && (
                        <div className="text-sm theme-muted-text italic">This piece has found its home</div>
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
              <h2 className="text-3xl font-bold mb-6">About the Artist</h2>
              <div className="space-y-4 theme-muted-text text-lg leading-relaxed">
                {artistProfile?.bio && artistProfile.bio.length > 0 ? renderBlockText(artistProfile.bio) : null}
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
              {artistProfile?.profileImage ? (
                <Image
                  src={urlFor(artistProfile.profileImage).width(600).height(800).fit("crop").url()}
                  alt={artistProfile.profileImage.alt || "Artist Profile Photo"}
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

      {/* Stats Section */}
      <section className="py-16 scroll-animate">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="scroll-animate" style={{ transitionDelay: "0ms" }}>
              <div className="text-3xl font-bold">{availableCount}+</div>
              <div className="theme-muted-text">Available Works</div>
            </div>
            <div className="scroll-animate" style={{ transitionDelay: "100ms" }}>
              <div className="text-3xl font-bold">10+</div>
              <div className="theme-muted-text">Years Experience</div>
            </div>
            <div className="scroll-animate" style={{ transitionDelay: "200ms" }}>
              <div className="text-3xl font-bold">50+</div>
              <div className="theme-muted-text">Happy Collectors</div>
            </div>
            <div className="scroll-animate" style={{ transitionDelay: "300ms" }}>
              <div className="text-3xl font-bold">{siteConfig.business.shippingRegions.length}</div>
              <div className="theme-muted-text">Countries Shipped</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
