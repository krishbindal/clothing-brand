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
      name: 'featured',
      type: 'boolean',
      title: 'Featured Banner',
      description: 'Mark to force the drop intro animation for this campaign.',
      initialValue: false,
    }),
    defineField({
      name: 'dropTitle',
      type: 'string',
      title: 'Drop Title',
      description: 'Optional headline shown on the countdown/drop overlay.',
    }),
    defineField({
      name: 'dropDate',
      type: 'datetime',
      title: 'Drop Date',
      description: 'Scheduled launch time. If set and in the future, a countdown will appear until the drop hits.',
    }),
    defineField({
      name: 'isDropActive',
      type: 'boolean',
      title: 'Activate Luxury Drop Engine',
      description: 'Toggle to enable the countdown + drop animation for this campaign.',
      initialValue: false,
    }),
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
