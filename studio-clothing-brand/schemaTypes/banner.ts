import { defineField, defineType } from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle' }),
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'object',
      title: 'CTA',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
        defineField({ name: 'href', type: 'string', title: 'Href', validation: (Rule) => Rule.required() }),
      ],
    }),
  ],
})
