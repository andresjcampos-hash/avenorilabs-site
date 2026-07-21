import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

function cleanText(value: string) {
  return value.replace(/&nbsp;|&#160;/gi, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? {
    title: `${post.title} | Avenori Labs`,
    description: cleanText(post.excerpt),
    alternates: { canonical: `https://avenorilabs.vercel.app/blog/${post.slug}` },
    openGraph: { title: post.title, description: cleanText(post.excerpt), type: "article" },
  } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const paragraphs = post.content.split("\n\n").map(cleanText).filter(Boolean);
  const wordCount = paragraphs.join(" ").split(/\s+/).length;
  const readingTime = Math.max(2, Math.ceil(wordCount / 200));
  const relatedPosts = (await getPublishedPosts(6)).filter((item) => item.slug !== post.slug).slice(0, 3);

  return <main className="article-page">
    <header className="blog-nav"><Link className="wordmark" href="/">Avenori Labs<span>.</span></Link><nav><Link href="/">Início</Link><Link href="/blog">Blog</Link></nav><Link className="back-link" href="/blog">← Voltar ao blog</Link></header>
    <article className="article-shell">
      <div className="article-heading">
        <div className="article-kicker"><span>Radar Avenori</span><b>{post.category}</b></div>
        <h1>{post.title}</h1>
        <p className="article-deck">{cleanText(post.excerpt)}</p>
        <div className="article-meta"><span>{formatDate(post.publishedAt)}</span><span>{readingTime} min de leitura</span><span>Curadoria Avenori Labs</span></div>
      </div>
      <div className="article-body-layout">
        <aside className="article-aside">
          <span>Sobre esta publicação</span>
          <p>Conteúdo elaborado pela curadoria automática da Avenori Labs a partir de uma publicação externa selecionada por relevância.</p>
          <a href={post.sourceUrl} target="_blank" rel="noreferrer">Consultar fonte original <b>↗</b></a>
          <small>Fonte: {post.sourceName}</small>
        </aside>
        <div className="article-content">
          {paragraphs.map((paragraph, index) => <p className={index === 0 ? "article-lead" : undefined} key={`${index}-${paragraph}`}>{paragraph}</p>)}
          <div className="article-signature"><span />Avenori Labs · Tecnologia com contexto</div>
        </div>
      </div>
    </article>
    {relatedPosts.length > 0 && <section className="article-related">
      <div><p>Continue explorando</p><h2>Outras ideias que movimentam.</h2><Link href="/blog">Ver todos <span>↗</span></Link></div>
      <div className="article-related-grid">{relatedPosts.map((item, index) => <Link href={`/blog/${item.slug}`} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.category}</small><h3>{item.title}</h3><b>Ler artigo ↗</b></Link>)}</div>
    </section>}
    <section className="article-cta"><p>O próximo produto pode ser o seu</p><h2>Tem uma ideia?<br /><em>Vamos tirá-la do papel.</em></h2><a className="button-primary" href="https://wa.me/5512982664205?text=Ol%C3%A1%2C%20vim%20pelo%20blog%20da%20Avenori%20Labs." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></section>
  </main>;
}