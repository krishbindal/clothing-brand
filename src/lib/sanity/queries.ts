import { groq } from 'next-sanity'

export const getAllProductsQuery = groq`
  *[_type == "product"] | order(createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`

export const getFeaturedProductsQuery = groq`
  *[_type == "product" && isFeatured == true] | order(createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`

export const getNewArrivalsQuery = groq`
  *[_type == "product"] | order(createdAt desc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`

export const getCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }
`

export const getBannerQuery = groq`
  *[_type == "banner"][0] {
    _id,
    title,
    subtitle,
    image,
    eyebrow,
    cta
  }
`

export const getProductBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`

export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current
  }
`

export const getProductsByCategorySlugQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`

export const searchProductsQuery = groq`
  *[_type == "product" && title match $searchQuery + "*"] | order(createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    description,
    images,
    "category": category->name,
    "categorySlug": category->slug.current,
    stock,
    isFeatured,
    createdAt
  }
`
