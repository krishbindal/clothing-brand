import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'price', title: 'Price', type: 'number', validation: (rule) => rule.required().min(0) }),
    defineField({ name: 'discountPrice', title: 'Discount Price', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'category', title: 'Category', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'sizes', title: 'Sizes', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
  ],
})
