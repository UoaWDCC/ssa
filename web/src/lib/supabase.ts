import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Returns the shared Supabase client, creating it on first call.
// Defined as a function so the client is only created in the browser
// (inside a queryFn), never during SSR when env vars aren't available.
export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    )
  }
  return _client
}
