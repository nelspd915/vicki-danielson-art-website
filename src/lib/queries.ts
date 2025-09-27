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

export const artistProfileQuery = `*[_type=="artist" && isActive == true][0]{
  _id,
  profileImage,
  bio
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

export const collectionsQuery = `*[_type=="collection"]{
  _id, title, "slug": slug.current, heroImage
} | order(title asc)`;

export const artworksByCollectionQuery = `*[_type=="artwork" && references(^._id)]{
  _id, title, "slug": slug.current, images, medium, dimensions, year, price, status
}`;
