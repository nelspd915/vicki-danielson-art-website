import { defineType, defineField } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required()
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.min(1)
    }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "medium", type: "string" }),
    defineField({ name: "dimensions", type: "string" }), // e.g. "24×36 in"
    defineField({ name: "year", type: "number" }),
    defineField({ name: "price", type: "number" }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "Available" },
          { title: "Unavailable", value: "Unavailable" },
          { title: "Sold", value: "Sold" },
          { title: "Hidden", value: "Hidden" }
        ],
        layout: "radio"
      },
      initialValue: "Available",
      description:
        "Available/Unavailable show in gallery, Sold shows in gallery with overlay, Hidden doesn't show but counts in totals"
    }),
    defineField({
      name: "description",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "collection",
      type: "reference",
      to: [{ type: "collection" }]
    }),
    defineField({ name: "featured", type: "boolean" })
  ],
  preview: {
    select: { title: "title", media: "thumbnail" }
  }
});
