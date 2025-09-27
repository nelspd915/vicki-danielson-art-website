import { defineType, defineField } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage Content",
  type: "document",
  fields: [
    defineField({
      name: "navigationTitle",
      title: "Navigation Title",
      type: "string",
      description: "The site name that appears in the top-left navigation (e.g., 'Vicki Danielson Art')",
      validation: (Rule) => Rule.required().max(50)
    }),
    defineField({
      name: "siteTitle",
      title: "Homepage Main Title",
      type: "string",
      description: "The large title displayed on the homepage hero section (e.g., 'Vicki Danielson Art')",
      validation: (Rule) => Rule.required().max(100)
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      description: "Brief description of your art and style that appears below the title",
      validation: (Rule) => Rule.required().max(300)
    }),
    defineField({
      name: "featuredGalleryText",
      title: "Featured Gallery Description",
      type: "text",
      description: "Text that appears above the featured artwork gallery section",
      validation: (Rule) => Rule.required().max(300)
    }),
    defineField({
      name: "aboutTitle",
      title: "About Section Title",
      type: "string",
      description: "Title for the about section (e.g., 'Meet the Artist')",
      initialValue: "Meet the Artist",
      validation: (Rule) => Rule.required().max(100)
    }),
    defineField({
      name: "aboutText",
      title: "About Text",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" }
            ]
          }
        }
      ],
      description: "Your biography and artist statement - rich text with formatting options"
    }),
    defineField({
      name: "profileImage",
      title: "Profile Photo",
      type: "image",
      description: "Your artist photo that appears in the about section",
      options: {
        hotspot: true
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Alternative text for accessibility"
        }
      ]
    }),
    defineField({
      name: "isActive",
      title: "Use This Configuration",
      type: "boolean",
      description: "Toggle this on to use this configuration on the homepage. Only one should be active at a time.",
      initialValue: false
    })
  ],
  preview: {
    select: {
      navTitle: "navigationTitle",
      title: "siteTitle",
      subtitle: "siteDescription",
      media: "profileImage",
      isActive: "isActive"
    },
    prepare({ navTitle, title, subtitle, media, isActive }) {
      return {
        title: navTitle || title || "Homepage Configuration",
        subtitle: `${isActive ? "✅ ACTIVE" : "⭕ Inactive"} - ${subtitle || "No description"}`,
        media
      };
    }
  }
});
