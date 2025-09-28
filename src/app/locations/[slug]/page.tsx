import { client } from "@/sanity/lib/client";
import { locationBySlugQuery } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BuyButton from "@/components/buy-button";

interface Location {
  _id: string;
  name: string;
  type: string;
  status: string;
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
    medium?: string;
    dimensions?: string;
    year?: number;
    price?: number;
    status?: string;
  }>;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location: Location = await client.fetch(locationBySlugQuery, { slug });

  if (!location) {
    return { title: "Location Not Found" };
  }

  const imageUrl = location.images?.[0] ? urlFor(location.images[0])?.url() : null;

  return {
    title: `${location.name} | Vicki Danielson Art`,
    description: location.description || `Buy Vicki Danielson's artwork at ${location.name}`,
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl, alt: location.name }]
        }
      : undefined
  };
}

function formatAddress(address?: Location["address"]) {
  if (!address) return null;

  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country && address.country !== "United States") parts.push(address.country);

  return parts.join(", ");
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
      return "text-green-600 bg-green-50";
    case "upcoming":
      return "text-blue-600 bg-blue-50";
    case "permanent":
      return "text-purple-600 bg-purple-50";
    case "past":
      return "text-gray-500 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
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

function formatPrice(price?: number) {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const location: Location = await client.fetch(locationBySlugQuery, { slug });

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/locations"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Locations
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{location.name}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(location.status)}`}
                >
                  {getStatusLabel(location.status)}
                </span>
                <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">{location.type}</span>
              </div>
            </div>
          </div>

          {location.description && <p className="text-xl text-gray-600 mt-4 max-w-4xl">{location.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {location.images && location.images.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {location.images.map((image, index) => {
                    const imageUrl = urlFor(image)?.url();
                    return imageUrl ? (
                      <div key={index} className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={image.alt || `${location.name} image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Available Artwork */}
            {location.artworksOnDisplay && location.artworksOnDisplay.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Available Artwork ({location.artworksOnDisplay.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {location.artworksOnDisplay.map((artwork) => {
                    const imageUrl = artwork.images?.[0] ? urlFor(artwork.images[0])?.url() : null;
                    return (
                      <div
                        key={artwork._id}
                        className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {imageUrl && (
                          <Link
                            href={`/art/${artwork.slug}`}
                            className="block relative aspect-[4/3] bg-gray-100 overflow-hidden"
                          >
                            <Image
                              src={imageUrl}
                              alt={artwork.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </Link>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            <Link
                              href={`/art/${artwork.slug}`}
                              className="group-hover:text-blue-600 transition-colors duration-300"
                            >
                              {artwork.title}
                            </Link>
                          </h3>
                          {artwork.medium && <p className="text-sm text-gray-600 mb-1">{artwork.medium}</p>}
                          {artwork.dimensions && <p className="text-sm text-gray-600 mb-2">{artwork.dimensions}</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{formatPrice(artwork.price)}</span>
                            {artwork.status === "available" && artwork.price && (
                              <BuyButton slug={artwork.slug} title={artwork.title} price={artwork.price} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Partnership Dates */}
            {location.partnershipDates && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Partnership Dates</h3>
                <p className="text-gray-600">{formatPartnershipDates(location.partnershipDates)}</p>
              </div>
            )}

            {/* Address */}
            {location.address && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <p className="text-gray-600">{formatAddress(location.address)}</p>
              </div>
            )}

            {/* Contact Information */}
            {location.contact && (location.contact.phone || location.contact.email || location.contact.website) && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {location.contact.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <br />
                      <a href={`tel:${location.contact.phone}`} className="text-blue-600 hover:text-blue-800">
                        {location.contact.phone}
                      </a>
                    </div>
                  )}
                  {location.contact.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <br />
                      <a href={`mailto:${location.contact.email}`} className="text-blue-600 hover:text-blue-800">
                        {location.contact.email}
                      </a>
                    </div>
                  )}
                  {location.contact.website && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Website:</span>
                      <br />
                      <a
                        href={location.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-words"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
