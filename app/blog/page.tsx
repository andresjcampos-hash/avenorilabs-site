import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog de tecnologia | Avenori", description: "Conteúdo sobre tecnologia, inteligência artificial, design e produtos digitais." };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <main className="blog-page">
    <header className="blog-nav"><Link className="wordmark" href="/">Avenori<span>.</span></Link><nav><Link href="/">Início</Link><Link href="/#projetos">Projetos</Link><Link href="/#contato">Contato</Link></nav></header>
    <section className="blog-hero"><p className="eyebrow"><span /> Conteúdo e ideias</p><h1>Tecnologia para quem<br /><em>constrói o futuro.</em></h1><p>Análises, tendências e aprendizados sobre produtos digitais, design, negócios e inteligência artificial.</p></section>
    <section className="blog-list" aria-label="Artigos publicados">
      {posts.map((post, index) => <article className={index === 0 ? "blog-card featured" : "blog-card"} key={post.id}>
        <Link href={`/blog/${post.slug}`}><div className="blog-card-art"><span>{String(index + 1).padStart(2, "0")}</span><b>{post.category}</b></div><div className="blog-card-copy"><small>{formatDate(post.publishedAt)} · {post.sourceName}</small><h2>{post.title}</h2><p>{post.excerpt}</p><strong>Ler artigo <i>↗</i></strong></div></Link>
      </article>)}
    </section>
    <footer><Link className="wordmark" href="/">Avenori<span>.</span></Link><p>Produtos digitais com estratégia, design e tecnologia.</p><div><Link href="/">Início</Link><Link href="/#projetos">Projetos</Link></div><small>© 2026 Avenori.</small></footer>
  </main>;
}
