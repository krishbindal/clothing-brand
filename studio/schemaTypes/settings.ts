import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'general',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.email(),
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform (e.g. Instagram)', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
      group: 'social',
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping Information',
      type: 'array',
      of: [{type: 'block'}],
      group: 'policies',
    }),
    defineField({
      name: 'returnPolicy',
      title: 'Return Policy',
      type: 'array',
      of: [{type: 'block'}],
      group: 'policies',
    }),
  ],
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'contact',
      title: 'Contact',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'policies',
      title: 'Policies',
    },
  ],
})
