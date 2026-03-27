import { defineField, defineType } from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle' }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA Text',
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'CTA Link',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
