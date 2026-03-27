import { createClient, type ClientConfig } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '51heegbl'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-03-26'

export const config: ClientConfig = {
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

export async function safeFetch<T>(operation: string, query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!projectId || !dataset) return fallback
  try {
    return await sanityClient.fetch(query, params)
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error)
    console.error(`Sanity fetch failed (${operation}): ${details}`)
    return fallback
  }
}
