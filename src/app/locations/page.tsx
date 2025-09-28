import { client } from "@/sanity/lib/client";
import { locationsQuery } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Location {
  _id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  featured: boolean;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  partnershipDates?: {
    startDate?: string;
    endDate?: string;
  };
  images?: Array<{
    alt?: string;
    caption?: string;
    asset: {
      _ref: string;
      _type: string;
    };
  }>;
  artworksOnDisplay?: Array<{
    _id: string;
    title: string;
    slug: string;
    images?: Array<{
      alt?: string;
      asset: {
        _ref: string;
        _type: string;
      };
    }>;
  }>;
}

export const metadata: Metadata = {
  title: "Where to Buy | Vicki Danielson Art",
  description: "Find Vicki Danielson's artwork at local galleries, shops, and retail partners."
};

function formatAddress(address?: Location["address"]) {
  if (!address) return null;

  const parts = [
    address.street,
    address.city && address.state ? `${address.city}, ${address.state}` : address.city || address.state,
    address.zipCode
  ].filter(Boolean);

  return parts.join(" • ");
}

function formatPartnershipDates(dates?: Location["partnershipDates"]) {
  if (!dates?.startDate) return null;

  const start = new Date(dates.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  if (dates.endDate) {
    const end = new Date(dates.endDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    return `${start} - ${end}`;
  }

  return `Started ${start}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "current":
      return "text-green-600";
    case "upcoming":
      return "text-blue-600";
    case "permanent":
      return "text-purple-600";
    case "past":
      return "text-gray-500";
    default:
      return "text-gray-600";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "current":
      return "Currently Selling";
    case "upcoming":
      return "Coming Soon";
    case "permanent":
      return "Permanent Partner";
    case "past":
      return "Past Partnership";
    default:
      return status;
  }
}

export default async function LocationsPage() {
  const locations: Location[] = await client.fetch(locationsQuery);

  if (!locations || locations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Where to Buy My Work</h1>
            <p className="text-xl text-gray-600">Check back soon for retail locations and gallery partnerships.</p>
          </div>
        </div>
      </div>
    );
  }

  // Separate featured and regular locations
  const featuredLocations = locations.filter((location) => location.featured);
  const regularLocations = locations.filter((location) => !location.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/gallery"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Artwork
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Where to Buy My Work</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visit these local galleries, shops, and retail partners to see and purchase my artwork in person.
          </p>
        </div>

        {/* Featured Locations */}
        {featuredLocations.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Partners</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredLocations.map((location) => (
                <LocationCard key={location._id} location={location} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Locations */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {featuredLocations.length > 0 ? "All Retail Partners" : "Retail Partners"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularLocations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationCard({ location, featured = false }: { location: Location; featured?: boolean }) {
  const imageUrl = location.images?.[0] ? urlFor(location.images[0])?.url() : null;

  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        featured ? "border-2 border-amber-200" : ""
      }`}
    >
      {/* Image */}
      {imageUrl && (
        <div className={`relative ${featured ? "h-64" : "h-48"} bg-gray-100 overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={location.images?.[0]?.alt || `${location.name} storefront`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={
              featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            }
          />
          <div className="absolute top-4 left-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm ${getStatusColor(location.status)}`}
            >
              {getStatusLabel(location.status)}
            </span>
          </div>
          {featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white">
                Featured Partner
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
            {location.name}
          </h3>
          <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded ml-3 flex-shrink-0">
            {location.type}
          </span>
        </div>

        {location.description && <p className="text-gray-600 mb-4 line-clamp-3">{location.description}</p>}

        {/* Partnership Dates */}
        {location.partnershipDates && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Partnership:</span> {formatPartnershipDates(location.partnershipDates)}
          </div>
        )}

        {/* Address */}
        {location.address && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Location:</span> {formatAddress(location.address)}
          </div>
        )}

        {/* Contact */}
        <div className="flex flex-wrap gap-3 mt-4">
          {location.contact?.website && (
            <a
              href={location.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Visit Website
            </a>
          )}
          {location.contact?.phone && (
            <a href={`tel:${location.contact.phone}`} className="text-sm text-gray-600 hover:text-gray-800">
              {location.contact.phone}
            </a>
          )}
        </div>

        {/* Artworks on Display */}
        {location.artworksOnDisplay && location.artworksOnDisplay.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Available Artwork ({location.artworksOnDisplay.length})
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {location.artworksOnDisplay.slice(0, 4).map((artwork) => {
                const artworkImageUrl = artwork.images?.[0] ? urlFor(artwork.images[0])?.url() : null;
                return artworkImageUrl ? (
                  <Link
                    key={artwork._id}
                    href={`/art/${artwork.slug}`}
                    className="relative w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform"
                  >
                    <Image
                      src={artworkImageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover rounded-full"
                      sizes="32px"
                    />
                  </Link>
                ) : null;
              })}
              {location.artworksOnDisplay.length > 4 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-600">
                  +{location.artworksOnDisplay.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
