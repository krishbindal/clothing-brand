import { groq } from 'next-sanity'

export const productFields = groq`
  {
    "id": _id,
    name,
    "slug": slug.current,
    price,
    description,
    stock,
    featured,
    "images": images[]{
      "url": asset->url,
      "alt": coalesce(alt, asset->altText),
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    "category": category->name,
    "categorySlug": category->slug.current,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
  }
`

export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) ${productFields}
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && (category->slug.current == $category || category->name == $category)] | order(_createdAt desc) ${productFields}
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(_createdAt desc) ${productFields}
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] ${productFields}
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const bannerQuery = groq`
  *[_type == "banner"] | order(_createdAt desc)[0] {
    title,
    "image": image.asset->url,
    link
  }
`

export const searchProductsQuery = groq`
  *[_type == "product" && (
    name match $q + "*" ||
    description match $q + "*" ||
    category->name match $q + "*"
  )] | order(_createdAt desc) ${productFields}
`
