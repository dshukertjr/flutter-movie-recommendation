import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

// Get the environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')
if (!supabaseUrl) {
  throw 'Environment variable SUPABASE_URL is not set'
}
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
if (!supabaseServiceKey) {
  throw 'Environment variable SUPABASE_SERVICE_ROLE_KEY is not set'
}
/** API key for TMDB API */
const tmdbApiKey = Deno.env.get('TMDB_API_KEY')
if (!tmdbApiKey) {
  throw 'Environment variable TMDB_KEY is not set'
}
/** API key for Open AI API */
const openAiApiKey = Deno.env.get('OPEN_AI_API_KEY')
if (!openAiApiKey) {
  throw 'Environment variable OPEN_AI_API_KEY is not set'
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Film {
  id: number
  title: string
  overview: string
  release_date: string
  backdrop_path: string
}

interface SupabaseFilm extends Film {
  embedding: number[]
}

serve(async (req) => {
  const { year } = await req.json()

  const searchParams = new URLSearchParams()
  searchParams.set('sort_by', 'popularity.desc')
  searchParams.set('page', '1')
  searchParams.set('language', 'en-US')
  searchParams.set('primary_release_year', `${year}`)
  searchParams.set('include_adult', 'false')
  searchParams.set('include_video', 'false')
  searchParams.set('region', 'US')
  searchParams.set('watch_region', 'US')
  searchParams.set('with_original_language', 'en')

  const tmdbResponse = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tmdbApiKey}`,
      },
    }
  )

  const tmdbJson = await tmdbResponse.json()
  const results = tmdbJson.results as Film[]

  const dtoFilms: SupabaseFilm[] = []

  for (const film of results) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        input: film.overview,
        model: 'text-embedding-ada-002',
      }),
    })

    const responseData = await response.json()
    const embedding = responseData.data[0].embedding

    dtoFilms.push({ ...film, embedding })
  }

  await supabase.from('films').upsert(dtoFilms)

  return new Response(
    JSON.stringify({
      message: `${dtoFilms.length} films added for year ${year}`,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
