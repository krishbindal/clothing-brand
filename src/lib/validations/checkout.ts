import { z } from 'zod'

export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  line1: z.string().min(1, 'Address is required').max(100),
  line2: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(1, 'State is required').max(50),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(50),
  phone: z.string().max(20).optional(),
})

export const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  shippingAddress: addressSchema,
  saveAddress: z.boolean().default(false),
})

export type AddressFormData = z.infer<typeof addressSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
