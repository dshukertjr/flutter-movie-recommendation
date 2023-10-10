create extension vector
with
  schema extensions;

create table public.films (
  id integer primary key,
  title text,
  overview text,
  release_date date,
  backdrop_path text,
  embedding vector(1536)
);

alter table public.films enable row level security;

create policy "Fils are public." on public.films for select using (true);
