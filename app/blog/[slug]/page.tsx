import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: `${post.title} | Avenori`, description: post.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return <main className="article-page">
    <header className="blog-nav"><Link className="wordmark" href="/">Avenori<span>.</span></Link><Link className="back-link" href="/blog">← Voltar ao blog</Link></header>
    <article><div className="article-heading"><p>{post.category}</p><h1>{post.title}</h1><div><span>{formatDate(post.publishedAt)}</span><span>Fonte: <a href={post.sourceUrl} target="_blank" rel="noreferrer">{post.sourceName} ↗</a></span></div></div>
      <div className="article-content"><p className="article-lead">{post.excerpt}</p>{post.content.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
    <section className="article-cta"><p>Tem uma ideia para transformar?</p><h2>Vamos construir algo relevante.</h2><Link className="button-primary" href="/#contato">Conversar com a Avenori <span>↗</span></Link></section>
  </main>;
}
