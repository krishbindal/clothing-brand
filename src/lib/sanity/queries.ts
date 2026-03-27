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
    tags,
    category,
    "image": image{
      ...,
      "url": asset->url,
      "asset": asset->{
        _id,
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      },
      "alt": coalesce(alt, asset->altText, name),
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    "images": coalesce(
      images[]{
        "url": asset->url,
        "asset": asset->{
          _id,
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        "alt": coalesce(alt, asset->altText, name),
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      },
      select(defined(image) => [image{
        "url": asset->url,
        "asset": asset->{
          _id,
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        "alt": coalesce(alt, asset->altText, name),
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }], [])
    ),
    "createdAt": coalesce(createdAt, _createdAt),
    "updatedAt": coalesce(_updatedAt, _createdAt)
  }
`

export const allProductsQuery = groq`
  *[_type == "product"] | order(coalesce(createdAt, _createdAt) desc) ${productFields}
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && (
    category == $category ||
    category == coalesce(*[_type == "category" && slug.current == $category][0].name, "")
  )] | order(coalesce(createdAt, _createdAt) desc) ${productFields}
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(coalesce(createdAt, _createdAt) desc) ${productFields}
`

export const trendingProductsQuery = groq`
  *[_type == "product" && featured == true] | order(coalesce(createdAt, _createdAt) desc)[0...6] ${productFields}
`

export const newArrivalsQuery = groq`
  *[_type == "product"] | order(coalesce(createdAt, _createdAt) desc)[0...8] ${productFields}
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] ${productFields}
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && category == ^.name]),
    "cover": *[_type == "product" && category == ^.name][0].image{
      "url": asset->url,
      "asset": asset->{
        _id,
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      },
      "alt": coalesce(alt, asset->altText, name),
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && category == ^.name])
  }
`

export const bannerQuery = groq`
  *[_type == "banner"] | order(_createdAt desc)[0] {
    title,
    subtitle,
    ctaText,
    ctaLink,
    "image": image{
      "url": asset->url,
      "asset": asset->{
        _id,
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      },
      "alt": coalesce(alt, asset->altText, title),
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`

export const searchProductsQuery = groq`
  *[_type == "product" && (
    name match $q + "*" ||
    description match $q + "*" ||
    category match $q + "*"
  )] | order(coalesce(createdAt, _createdAt) desc) ${productFields}
`
