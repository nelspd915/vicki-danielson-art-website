import { defineField, defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Retail Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Gallery/Location Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "type",
      title: "Location Type",
      type: "string",
      options: {
        list: [
          { title: "Art Gallery", value: "gallery" },
          { title: "Gift Shop", value: "giftshop" },
          { title: "Boutique", value: "boutique" },
          { title: "Art Fair", value: "artfair" },
          { title: "Studio/Workshop", value: "studio" },
          { title: "Online Store", value: "online" },
          { title: "Other", value: "other" }
        ],
        layout: "radio"
      },
      initialValue: "gallery"
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Currently Selling", value: "current" },
          { title: "Coming Soon", value: "upcoming" },
          { title: "Permanent Partner", value: "permanent" },
          { title: "Past Partnership", value: "past" }
        ],
        layout: "radio"
      },
      initialValue: "current"
    }),
    defineField({
      name: "featured",
      title: "Featured Location",
      type: "boolean",
      description: "Show prominently on retail locations page",
      initialValue: false
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description of your partnership or relationship with this retail location"
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street Address" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State/Province" },
        { name: "zipCode", type: "string", title: "ZIP/Postal Code" },
        { name: "country", type: "string", title: "Country", initialValue: "United States" }
      ]
    }),
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        { name: "phone", type: "string", title: "Phone Number" },
        { name: "email", type: "email", title: "Email" },
        { name: "website", type: "url", title: "Website" }
      ]
    }),
    defineField({
      name: "partnershipDates",
      title: "Partnership Dates",
      type: "object",
      fields: [
        { name: "startDate", type: "date", title: "Start Date" },
        { name: "endDate", type: "date", title: "End Date (if applicable)" }
      ],
      hidden: ({ document }) => document?.status === "permanent"
    }),
    defineField({
      name: "images",
      title: "Location Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility."
            },
            {
              name: "caption",
              type: "string",
              title: "Caption"
            }
          ]
        }
      ]
    }),
    defineField({
      name: "artworksOnDisplay",
      title: "Artworks on Display",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "artwork" }]
        }
      ],
      description: "Select which artworks are displayed at this location"
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first"
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      status: "status",
      media: "images.0"
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle} • ${status}`,
        media
      };
    }
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" }
      ]
    }
  ]
});
