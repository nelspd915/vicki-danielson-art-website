export const galleryQuery = `*[_type=="artwork"] | order(featured desc, year desc, _createdAt desc)[0...60]{
  _id,
  title,
  "slug": slug.current,
  images,
  medium,
  dimensions,
  year,
  price,
  status,
  featured
}`;

export const featuredQuery = `*[_type=="artwork" && featured == true] | order(year desc, _createdAt desc)[0...6]{
  _id,
  title,
  "slug": slug.current,
  images,
  medium,
  dimensions,
  year,
  price,
  status,
  featured
}`;

export const homepageQuery = `*[_type=="homepage" && isActive == true][0]{
  _id,
  navigationTitle,
  siteTitle,
  siteDescription,
  featuredGalleryText,
  aboutTitle,
  aboutText,
  profileImage
}`;

export const artworkBySlugQuery = `*[_type=="artwork" && slug.current == $slug][0]{
  _id,
  title,
  images,
  medium,
  dimensions,
  year,
  price,
  status,
  description
}`;

export const locationsQuery = `*[_type=="location"] | order(featured desc, order asc, name asc){
  _id,
  name,
  "slug": slug.current,
  type,
  status,
  featured,
  description,
  address,
  contact,
  partnershipDates,
  images,
  artworksOnDisplay[]->{
    _id,
    title,
    "slug": slug.current,
    images[0]
  }
}`;

export const locationBySlugQuery = `*[_type=="location" && slug.current == $slug][0]{
  _id,
  name,
  type,
  status,
  description,
  address,
  contact,
  partnershipDates,
  images,
  artworksOnDisplay[]->{
    _id,
    title,
    "slug": slug.current,
    images,
    medium,
    dimensions,
    year,
    price,
    status
  }
}`;
