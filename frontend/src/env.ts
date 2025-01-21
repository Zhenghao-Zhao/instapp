import { z, string } from 'zod'
export const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: string(),
  NEXT_PUBLIC_SUPABASE_URL: string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
  R2_CUSTOM_AUTH_KEY: string(),
  R2_BUCKET_URL: string(),
  R2_BUCKET_URL_TEST: string(),
  R2_BUCKET_URL_PUBLIC: string(),
})

export const ENV = envSchema.parse(process.env);