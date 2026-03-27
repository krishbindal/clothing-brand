import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'promotion',
  title: 'Promotion / Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage (%)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (rule) => rule.required().custom((endDate, context) => {
        const startDate = context.document?.startDate as string | undefined
        if (startDate && endDate && new Date(endDate as string) <= new Date(startDate)) {
          return 'End date must be after start date'
        }
        return true
      }),
    }),
    defineField({
      name: 'applicableProducts',
      title: 'Applicable Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      description: 'Leave empty if this promotion applies to all products.',
    }),
  ],
})
