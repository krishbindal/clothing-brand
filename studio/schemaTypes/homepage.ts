import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text',
      type: 'string',
      group: 'announcement',
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      group: 'features',
    }),
    defineField({
      name: 'featuredCollections',
      title: 'Featured Collections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'collection'}]}],
      group: 'features',
    }),
  ],
  groups: [
    {
      name: 'hero',
      title: 'Hero Section',
    },
    {
      name: 'announcement',
      title: 'Announcement Bar',
    },
    {
      name: 'features',
      title: 'Features',
    },
  ],
})
