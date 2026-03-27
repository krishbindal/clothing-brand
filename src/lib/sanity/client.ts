import { createClient, type ClientConfig } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const envDataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const projectId = envProjectId || '51heegbl'
export const dataset = envDataset || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-26'
const hasEnvConfig = Boolean(envProjectId && envDataset)
export const isSanityConfigured = Boolean(projectId && dataset)
let hasWarnedMissingEnv = false
const loggedOperations = new Set<string>()

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}

export const sanityClient = createClient(config)

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function fetchSanityData<T>(
  operationName: string,
  query: string,
  {
    params = {},
    tags,
    revalidate = 60,
    fallback,
  }: { params?: Record<string, unknown>; tags?: string[]; revalidate?: number; fallback: T },
): Promise<T> {
  if (!isSanityConfigured) return fallback

  if (!hasEnvConfig) {
    if (!hasWarnedMissingEnv) {
      console.warn('Sanity env vars missing; returning fallback data.')
      hasWarnedMissingEnv = true
    }
    return fallback
  }

  try {
    return await sanityClient.fetch(query, params, {
      next: {
        revalidate,
        tags,
      },
    })
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error)
    if (!loggedOperations.has(operationName)) {
      loggedOperations.add(operationName)
      console.error(`Sanity fetch failed (${operationName}): ${details}`)
    }
    return fallback
  }
}
