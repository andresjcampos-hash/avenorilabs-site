create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null default 'Tecnologia',
  source_name text not null,
  source_url text unique not null,
  image_url text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
create policy "Artigos publicados são públicos" on public.blog_posts for select using (published = true);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published, published_at desc);