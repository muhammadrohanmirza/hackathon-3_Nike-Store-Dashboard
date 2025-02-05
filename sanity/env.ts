export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-04'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skpQISoVzpSUkWJqQUTS2XvqPc97Qj7Kofor77jHI72yEyaAI5AKgXWdDeBtQ7sDmQAxs1KClNjotP2YASNr7KEuPBD0XyOKb1ZgtDyUFLXCCu7WSRKZwawO9IPZwS4arT77mJHrYuCp3eOrWNY1fjSAW8KirlUXYFgiyJBOeiD75PJrylAL",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
