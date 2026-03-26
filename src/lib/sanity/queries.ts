import { groq } from 'next-sanity'

export const PRODUCT_FIELDS = groq`{
  "id": _id,
  name,
  "slug": slug.current,
  price,
  "comparePrice": discountPrice,
  inStock,
  "images": images[].asset->url,
  "category": category->name,
  "sizes": sizes,
  "colors": colors,
  "description": pt::text(description),
  "featured": featured,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
}`

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) ${PRODUCT_FIELDS}
`

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[_type == "product" && category->name == $category] | order(_createdAt desc) ${PRODUCT_FIELDS}
`

export const PRODUCTS_BY_CATEGORY_SLUG_QUERY = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) ${PRODUCT_FIELDS}
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] ${PRODUCT_FIELDS}
`

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && featured == true] | order(_createdAt desc) ${PRODUCT_FIELDS}
`

export const SEARCH_PRODUCTS_QUERY = groq`
  *[_type == "product" && (
    name match $searchQuery + "*" ||
    pt::text(description) match $searchQuery + "*" ||
    category->name match $searchQuery + "*"
  )] | order(_createdAt desc) ${PRODUCT_FIELDS}
`

export const CATEGORIES_WITH_COUNT_QUERY = groq`
  *[_type == "category"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`
