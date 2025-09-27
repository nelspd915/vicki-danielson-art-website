import { defineType, defineField } from "sanity";

export default defineType({
  name: "artist",
  title: "Artist Profile",
  type: "document",
  icon: () => "👨‍🎨",
  fields: [
    defineField({
      name: "isActive",
      title: "Active Profile Photo",
      type: "boolean",
      description:
        "Toggle this ON to make this the active profile photo on the website. Only one should be active at a time.",
      initialValue: false
    }),
    defineField({
      name: "profileImage",
      title: "Profile Photo",
      type: "image",
      description: "Professional headshot or profile photo of the artist",
      options: {
        hotspot: true // Enables focal point selection
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: 'Important for accessibility and SEO (e.g., "Vicki Danielson in her studio")',
          validation: (rule) => rule.required()
        }
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "bio",
      title: "Artist Biography",
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
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" }
            ]
          }
        }
      ],
      description: "Biography text that appears in the About section on the homepage"
    })
  ],
  preview: {
    select: {
      title: "isActive",
      media: "profileImage",
      subtitle: "bio"
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title: title ? "✅ Active Profile Photo" : "📷 Profile Photo",
        subtitle: subtitle ? "Has biography" : "No biography",
        media
      };
    }
  }
});
