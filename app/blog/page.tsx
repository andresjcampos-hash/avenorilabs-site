import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Radar Avenori — Tecnologia, produtos digitais e negócios",
  description: "Curadoria Avenori Labs sobre inteligência artificial, inovação, design, produtos digitais e negócios.",
  alternates: { canonical: "https://avenorilabs.vercel.app/blog" },
  openGraph: {
    title: "Radar Avenori — Tecnologia com contexto",
    description: "Ideias, movimentos e tecnologias para quem constrói o futuro.",
    url: "https://avenorilabs.vercel.app/blog",
    type: "website",
  },
};

function cleanText(value: string) {
  return value.replace(/&nbsp;|&#160;/gi, " ").replace(/\s+/g, " ").trim();
}

export default async function BlogPage() {
  const posts = await getPublishedPosts(12);
  const [featured, ...latest] = posts;
  const categories = Array.from(new Set(posts.map((post) => post.category))).slice(0, 4);

  return <main className="blog-page blog-index">
    <header className="blog-nav blog-index-nav">
      <Link className="wordmark" href="/">Avenori Labs<span>.</span></Link>
      <nav><Link href="/">Início</Link><Link href="/#empresa">Empresa</Link><Link href="/#projetos">Projetos</Link></nav>
      <Link className="back-link" href="/#contato">Vamos conversar ↗</Link>
    </header>

    <section className="blog-index-hero">
      <div>
        <p className="eyebrow"><span /> Radar Avenori</p>
        <h1>Tecnologia com contexto.<br /><em>Ideias que movimentam.</em></h1>
      </div>
      <div className="blog-index-intro">
        <p>Uma curadoria sobre os movimentos que estão transformando produtos, operações e decisões de negócio.</p>
        <small>Atualização automática · seleção por relevância · leitura em português</small>
      </div>
    </section>

    {categories.length > 0 && <div className="blog-topics" aria-label="Assuntos do Radar Avenori">
      <span>Explorar</span>{categories.map((category) => <b key={category}>{category}</b>)}
    </div>}

    {featured && <section className="blog-featured" aria-label="Artigo em destaque">
      <Link href={`/blog/${featured.slug}`} className="blog-featured-art"><span>01</span><small>Em destaque</small><div /><b>{featured.category}</b></Link>
      <div className="blog-featured-copy">
        <small>{formatDate(featured.publishedAt)} · {featured.sourceName}</small>
        <p>Leitura selecionada</p>
        <h2>{featured.title}</h2>
        <div>{cleanText(featured.excerpt)}</div>
        <Link href={`/blog/${featured.slug}`}>Ler publicação <span>↗</span></Link>
      </div>
    </section>}

    {latest.length > 0 && <section className="blog-latest" aria-label="Publicações recentes">
      <div className="blog-latest-heading"><div><p>Publicações recentes</p><h2>Continue explorando.</h2></div><span>{posts.length.toString().padStart(2, "0")} conteúdos disponíveis</span></div>
      <div className="blog-latest-grid">{latest.map((post, index) => <article key={post.id}>
        <Link href={`/blog/${post.slug}`}>
          <div><span>{String(index + 2).padStart(2, "0")}</span><small>{post.category}</small></div>
          <p>{formatDate(post.publishedAt)} · {post.sourceName}</p>
          <h3>{post.title}</h3>
          <div className="blog-card-excerpt">{cleanText(post.excerpt)}</div>
          <b>Ler artigo <i>↗</i></b>
        </Link>
      </article>)}</div>
    </section>}

    <section className="blog-curation">
      <div><p>Como funciona</p><h2>Curadoria automática.<br /><em>Contexto humano.</em></h2></div>
      <div><p>Todos os dias, o Radar Avenori acompanha fontes abertas e seleciona conteúdos relacionados a tecnologia, inteligência artificial, produtos digitais, inovação e negócios.</p><p>Cada publicação identifica sua fonte original. A proposta não é substituir o jornalismo, mas facilitar a descoberta de temas relevantes para quem está construindo produtos e empresas.</p><Link href="/#empresa">Conheça a Avenori Labs <span>↗</span></Link></div>
    </section>

    <section className="article-cta blog-index-cta"><p>O próximo produto pode ser o seu</p><h2>Uma boa ideia merece<br /><em>um caminho claro.</em></h2><a className="button-primary" href="https://wa.me/5512982664205?text=Ol%C3%A1%2C%20vim%20pelo%20Radar%20Avenori." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></section>

    <footer className="blog-index-footer"><Link className="wordmark" href="/">Avenori Labs<span>.</span></Link><p>Estratégia, design e tecnologia para transformar ideias em produtos digitais.</p><div><Link href="/">Início</Link><Link href="/#projetos">Projetos</Link><Link href="/#contato">Contato</Link></div><small>© 2026 Avenori Labs.</small></footer>
  </main>;
}