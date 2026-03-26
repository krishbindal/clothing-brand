import { createClient, type ClientConfig } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'gbjuq696'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const apiVersion = '2024-03-26'
export const isSanityConfigured = Boolean(projectId && dataset)

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface FetchSanityOptions<T> {
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number
  fallback: T
}

export async function fetchSanityData<T>(
  operationName: string,
  query: string,
  { params = {}, tags, revalidate = 60, fallback }: FetchSanityOptions<T>,
): Promise<T> {
  if (!isSanityConfigured) return fallback

  try {
    return await sanityClient.fetch(query, params, {
      next: {
        revalidate,
        tags,
      },
    })
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error)
    console.error(`Sanity fetch failed (${operationName}): ${details}`)
    return fallback
  }
}
