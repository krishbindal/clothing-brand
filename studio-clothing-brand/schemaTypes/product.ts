import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Primary Image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.max(120),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stock',
      type: 'number',
      title: 'Stock',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured', initialValue: false }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
