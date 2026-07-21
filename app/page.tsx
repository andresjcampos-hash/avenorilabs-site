import Image from "next/image";
import type { Metadata } from "next";
import { formatDate, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Avenori Labs — Estúdio de produtos digitais (estratégia, design e tecnologia)",
  description:
    "Estúdio brasileiro que une estratégia, design e tecnologia para transformar ideias em produtos digitais que geram resultados reais. MVPs, SaaS, apps e plataformas sob medida.",
  openGraph: {
    title: "Avenori Labs — Estúdio de produtos digitais",
    description:
      "Estratégia, design e tecnologia para transformar ideias em produtos digitais que geram resultados reais.",
    url: "https://avenorilabs.vercel.app/",
    siteName: "Avenori Labs",
    locale: "pt_BR",
    type: "website",
  },
  alternates: {
    canonical: "https://avenorilabs.vercel.app/",
  },
};

const projects = [
  {
    index: "01",
    name: "NutriGuest Web",
    category: "SaaS para nutricionistas",
    description:
      "Gestão clínica com IA integrada, portal do paciente e planos comerciais ativos de pacientes a prontuário, tudo em uma plataforma em produção.",
    accent: "violet",
    mark: "NG",
    status: "Produto digital",
    image: "/projects/nutriguest-web.png",
    imageAlt: "Painel profissional do NutriGuest Web",
    href: "https://nutriguest.com/",
  },
  {
    index: "02",
    name: "NutriGuest App",
    category: "Experiência mobile",
    description:
      "A jornada do paciente na palma da mão plano alimentar, diário, evolução corporal e hidratação em uma experiência que aumenta a adesão ao tratamento.",
    accent: "cyan",
    mark: "N•",
    status: "Aplicativo",
    image: "/projects/nutriguest-app.jpg",
    imageAlt: "Aplicativo NutriGuest exibindo a evolução do paciente",
  },
  {
    index: "03",
    name: "Investimentos Imobiliários",
    category: "Plataforma imobiliária",
    description:
      "Ecossistema de três frentes Hub, MRV e SCP que qualifica o visitante pelo perfil de investimento antes mesmo do primeiro contato.",
    accent: "blue",
    mark: "VI",
    status: "Web experience",
    image: "/projects/investimentos-imobiliarios.png",
    imageAlt: "Página de investimentos imobiliários",
    href: "https://valeria-investimentos.vercel.app/",
  },
  {
    index: "04",
    name: "Juraxis",
    category: "Legaltech",
    description:
      "Um sistema jurídico completo, com ambiente autenticado por escritório, para organizar clientes, processos, agenda, finanças e conhecimento.",
    accent: "ice",
    mark: "JX",
    status: "Software jurídico",
    image: "/projects/juraxis.png",
    imageAlt: "Painel de gestão jurídica do Juraxis",
    href: "https://https://juraxis.vercel.app/",
  },
];

const capabilities = [
  ["01", "Estratégia", "Descobrimos o problema certo antes de desenhar a solução."],
  ["02", "Design", "Criamos experiências claras, desejáveis e fáceis de usar."],
  ["03", "Tecnologia", "Construímos produtos rápidos, seguros e prontos para evoluir."],
  ["04", "Evolução", "Medimos, aprendemos e refinamos cada entrega continuamente."],
];

const audiences = [
  ["01", "Uma ideia para validar", "Para quem precisa transformar uma oportunidade em um produto claro, viável e pronto para dar os primeiros passos."],
  ["02", "Um negócio para digitalizar", "Para empresas que querem substituir processos manuais por experiências digitais mais simples e eficientes."],
  ["03", "Um produto para evoluir", "Para negócios que já possuem uma solução e precisam melhorar experiência, tecnologia, desempenho ou posicionamento."],
  ["04", "Uma parceria de longo prazo", "Para quem procura proximidade, visão de negócio e acompanhamento contínuo depois do lançamento."],
];

const faqItems = [
  ["01", "Como um projeto começa?", "Começamos com uma conversa de diagnóstico para entender o negócio, o público, o desafio e o resultado esperado."],
  ["02", "É possível começar com um MVP?", "Sim. Definimos a menor versão capaz de validar a ideia, gerar aprendizado e preparar uma evolução segura."],
  ["03", "A Avenori acompanha após a entrega?", "Sim. Podemos cuidar de melhorias, manutenção e novas etapas para que o produto continue evoluindo."],
  ["04", "O código pertence ao cliente?", "Em projetos desenvolvidos para clientes, a propriedade e as condições de entrega são definidas com clareza na proposta."],
];

// Dados estruturados (JSON-LD) para o Google entender quem é a Avenori
// e, potencialmente, exibir o FAQ como rich snippet nos resultados de busca.
// Isso não renderiza nada visível — só um <script type="application/ld+json">.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Avenori Labs",
  url: "https://avenorilabs.vercel.app/",
  description:
    "Estúdio brasileiro de produtos digitais. Estratégia, design e tecnologia por trás de SaaS, aplicativos, plataformas imobiliárias e sistemas jurídicos em produção.",
  email: "contato@avenori.com.br",
  telephone: "+55 12 98266-4205",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55 12 98266-4205",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(([, question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export default async function Home() {
  const blogPosts = await getPublishedPosts(3);
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="nav-shell">
        <a className="wordmark" href="#inicio" aria-label="Avenori — início">
          Avenori Labs<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#empresa">Empresa</a>
          <a href="#servicos">O que fazemos</a>
          <a href="#projetos">Projetos</a>
          <a href="/blog">Blog</a>
        </nav>
        <a className="nav-cta" href="#contato">
          Vamos conversar <span>↗</span>
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Estúdio brasileiro de produtos digitais</p>
          <h1>
            Transformamos ideias em produtos digitais que geram <em>resultados reais.</em>
          </h1>
          <p className="hero-text">
            Unimos estratégia, design e tecnologia para criar experiências digitais bonitas, inteligentes e prontas para crescer.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#projetos">Conheça nossas soluções <span>↓</span></a>
            <a className="text-link" href="#empresa">Descubra a Avenori <span>↘</span></a>
          </div>
        </div>

        <div className="constellation" aria-label="Produtos Avenori">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <span className="star star-one" /><span className="star star-two" />
          <span className="star star-three" /><span className="star star-four" />
          <div className="core"><span /></div>
          <div className="orbiting-system">
            <span className="orbiting-node orbiting-one"><a className="node" data-label="NutriGuest Web" aria-label="NutriGuest Web" href="#projetos"><i className="violet">NG</i><span>NutriGuest Web</span><b>↗</b></a></span>
            <span className="orbiting-node orbiting-two"><a className="node" data-label="NutriGuest App" aria-label="NutriGuest App" href="#projetos"><i className="cyan">N•</i><span>NutriGuest App</span><b>↗</b></a></span>
            <span className="orbiting-node orbiting-three"><a className="node" data-label="Investimentos Imobiliários" aria-label="Investimentos Imobiliários" href="#projetos"><i className="blue">VI</i><span>Investimentos Imobiliários</span><b>↗</b></a></span>
            <span className="orbiting-node orbiting-four"><a className="node" data-label="Juraxis" aria-label="Juraxis" href="#projetos"><i className="ice">JX</i><span>Juraxis</span><b>↗</b></a></span>
          </div>
        </div>

        <div className="hero-foot">
          <span>Design com intenção</span><span>Tecnologia com propósito</span><span>Produtos com futuro</span>
        </div>
      </section>

      <section className="about section" id="empresa">
        <div className="section-label"><span>01</span> Quem somos</div>
        <div className="about-layout">
          <h2>Estratégia que orienta.<br /><em>Design que conecta.</em><br />Tecnologia que entrega.</h2>
          <div className="about-copy">
            <p className="lead">A Avenori nasceu para aproximar boas ideias da tecnologia necessária para colocá-las em e isso já está rodando em produção, com usuários e planos pagos reais.</p>
            <p>Criamos produtos digitais com visão estratégica, cuidado visual e uma base técnica preparada para crescer. Antes de escrever a primeira linha de código, entendemos o negócio, as pessoas e o resultado que queremos construir.</p>
            <p>Trabalhamos próximos de fundadores, profissionais e empresas do diagnóstico ao lançamento, com acompanhamento para cada nova etapa. De um SaaS com IA a uma plataforma imobiliária com funil segmentado por perfil de cliente, cada entrega carrega a mesma obsessão por resultado.</p>
            <div className="numbers">
              <div><strong>04+</strong><span>produtos em produção</span></div>
              <div><strong>3</strong><span>modelos de negócio atendidos</span></div>
              <div><strong>1</strong><span>parceiro do início ao futuro</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="services section" id="servicos">
        <div className="section-label"><span>02</span> Como criamos</div>
        <div className="section-heading">
          <h2>Do primeiro insight<br />ao produto em movimento.</h2>
          <p>Cada etapa existe para reduzir incertezas e aumentar o valor percebido pelo usuário e pelo negócio.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span><div className="capability-icon">✦</div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services section" id="para-quem">
        <div className="section-label"><span>03</span> Para quem construímos</div>
        <div className="section-heading">
          <h2>Do primeiro projeto<br />à próxima fase do negócio.</h2>
          <p>A Avenori entra onde estratégia, design e tecnologia precisam trabalhar juntos para transformar intenção em resultado.</p>
        </div>
        <div className="capability-grid">
          {audiences.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span><div className="capability-icon">✦</div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="work section" id="projetos">
        <div className="section-label"><span>04</span> Produtos e projetos</div>
        <div className="section-heading">
          <h2>Ideias que já ganharam<br /><em>forma, função e futuro.</em></h2>
          <p>Produtos próprios e experiências digitais criadas para mercados diferentes, com a mesma obsessão por qualidade.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => {
            const content = (
              <>
                <div className={`project-visual ${project.accent}`}>
                  <div className="visual-grid" />
                  <div className={`project-shot ${project.accent}`}>
                    <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 700px) 100vw, 50vw" />
                  </div>
                  <span className="project-mark">{project.mark}</span>
                  <span className="project-index">{project.index}</span>
                </div>
                <div className="project-info">
                  <div><p>{project.category}</p><h3>{project.name}</h3></div>
                  <p>{project.description}</p><span className="project-arrow">↗</span>
                </div>
              </>
            );
            return project.href ? (
              <a
                className="project-card"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                key={project.name}
              >
                {content}
              </a>
            ) : (
              <article className="project-card" key={project.name}>{content}</article>
            );
          })}
        </div>
      </section>

      <section className="home-blog section" id="conteudos">
        <div className="section-label"><span>05</span> Conteúdo e ideias</div>
        <div className="section-heading">
          <h2>Tecnologia com contexto.<br /><em>Ideias que movimentam.</em></h2>
          <p>Uma curadoria Avenori sobre produtos digitais, design, inteligência artificial e negócios.</p>
        </div>
        <div className="home-blog-grid">
          {blogPosts.map((post, index) => <a href={`/blog/${post.slug}`} className="home-blog-card" key={post.id}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><b>{post.category}</b></div>
            <small>{formatDate(post.publishedAt)}</small><h3>{post.title}</h3><p>{post.excerpt}</p><strong>Ler artigo <i>↗</i></strong>
          </a>)}
        </div>
        <a className="blog-all-link" href="/blog">Ver todos os conteúdos <span>↗</span></a>
      </section>

      <section className="services section" id="duvidas">
        <div className="section-label"><span>06</span> Perguntas frequentes</div>
        <div className="section-heading">
          <h2>Clareza antes<br />de começar.</h2>
          <p>Algumas respostas para tornar o primeiro passo mais simples, transparente e seguro.</p>
        </div>
        <div className="capability-grid">
          {faqItems.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span><div className="capability-icon">✦</div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto section">
        <p>Não criamos apenas telas.</p>
        <h2>Criamos produtos que as pessoas entendem, desejam e escolhem usar.</h2>
      </section>

      <section className="contact section" id="contato">
        <div className="contact-glow" />
        <p className="eyebrow"><span /> O próximo produto pode ser o seu!</p>
        <h2>Tem uma ideia?<br /><em>Vamos tirá-la do papel.</em></h2>
        <p>Conte o que você quer construir. A primeira conversa serve para entender o momento do negócio, organizar possibilidades e encontrar o melhor caminho entre a ideia e um produto digital de verdade.</p>
        <a
          className="button-primary large"
          href="https://wa.me/5512982664205?text=Ol%C3%A1%2C%20Andr%C3%A9!%20Conheci%20a%20Avenori%20Labs%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar com André pelo WhatsApp"
        >
          Falar pelo WhatsApp <span>↗</span>
        </a>
      </section>

      <footer>
        <a className="wordmark" href="#inicio">Avenori Labs<span>.</span></a>
        <p>Produtos digitais com estratégia, design e tecnologia.</p>
        <div><a href="#empresa">Empresa</a><a href="#projetos">Projetos</a><a href="/blog">Blog</a><a href="#contato">Contato</a></div>
        <small>© 2026 Avenori Labs. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
