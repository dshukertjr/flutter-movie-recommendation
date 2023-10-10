# Semantic film recommendation engine

A Flutter app demonstrating how semantic search powered by Open AI and Supabase vector database can be used to build a recommendation engine for movie films.

## Getting Started

Obtain environment variables
Head to [TMDB API](https://developer.themoviedb.org/reference/intro/getting-started), and [Open AI API](https://openai.com/blog/openai-api) to create an API key. Then copy `supabase/.env.example` to `supabase/.env` and fill in the variables.

```bash
TMDB_API_KEY=your_tmdb_api_key
OPEN_AI_API_KEY=your_tmdb_api_key
```

Install the dependencies:

```bash
cd dart_edge
dart pub get
cd ..
cd flutter
dart pub get
```

Setup Supabase project

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Deploy edge functions

```bash
supabase functions deploy
```

Run the Flutter app

```bash

```

## Deploy the edge functions

`get_film_data` function does not need to be deployed to cloud as it just calls the TMDB API, Open AI API and stores the information to Supabase.

## Tools

- [Supabase](https://supabase.io/) - A full suit of tools to build your backend
- Flutter
- [Dart Edge](https://supabase.com/docs/guides/functions/dart-edge) - A tool kit to compile Edge Functions written in Dart to JavaScript to run them on the edge
