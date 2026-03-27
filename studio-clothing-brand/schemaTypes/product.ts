import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        defineField({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.max(140),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stock',
      type: 'number',
      title: 'Stock',
      description: 'Used for low-stock and sold-out labels',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'Featured',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
