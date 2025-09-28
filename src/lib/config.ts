// Site configuration - centralized constants and settings
export const siteConfig = {
  // Site information
  name: "Vicki Danielson Art",
  description: "Contemporary artwork featuring original paintings by Vicki Danielson",

  // Contact information
  contact: {
    email: process.env.NEXT_PUBLIC_ARTIST_EMAIL || "danielson787@gmail.com",
    commissionEmail: process.env.NEXT_PUBLIC_ARTIST_EMAIL || "danielson787@gmail.com",
    phone: process.env.NEXT_PUBLIC_PHONE || null,
    address: {
      city: "Duluth",
      state: "Minnesota",
      country: "USA"
    }
  },

  // Business settings
  business: {
    responseTime: "24-48 hours",
    shippingRegions: ["US", "CA"]
  },

  // Social media (add as needed)
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || null,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || null,
    twitter: process.env.NEXT_PUBLIC_TWITTER || null
  },

  // SEO defaults
  seo: {
    keywords: [
      "contemporary art",
      "original paintings",
      "fine art",
      "artwork for sale",
      "art commissions",
      "Vicki Danielson"
    ],
    openGraph: {
      type: "website",
      locale: "en_US"
    }
  }
} as const;

// Helper functions
export const getContactEmail = (type: "general" | "commission" = "general") => {
  return type === "commission" ? siteConfig.contact.commissionEmail : siteConfig.contact.email;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPriceExact = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const getFullAddress = (): string => {
  const { city, state, country } = siteConfig.contact.address;
  return `${city}, ${state}, ${country}`;
};
