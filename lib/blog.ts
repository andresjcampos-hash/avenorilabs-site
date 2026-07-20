export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string | null;
  published: boolean;
  publishedAt: string;
  createdAt: string;
};

export const seedPosts: BlogPost[] = [
  {
    id: "avenori-produto-digital",
    slug: "como-transformar-uma-ideia-em-produto-digital",
    title: "Como transformar uma ideia em um produto digital",
    excerpt: "O caminho entre uma boa ideia e um produto útil passa por estratégia, validação, design e evolução contínua.",
    content: "Uma ideia se transforma em produto quando resolve um problema real para pessoas reais. O primeiro passo não é programar: é entender o contexto, a necessidade e o resultado esperado.\n\nDepois da descoberta, criamos uma versão clara da proposta, desenhamos os fluxos essenciais e validamos as decisões antes de ampliar o investimento. Essa sequência reduz incertezas e mantém tecnologia, experiência e negócio trabalhando na mesma direção.\n\nUm bom produto digital nunca está totalmente parado. Dados, conversas com usuários e mudanças no mercado alimentam ciclos de evolução. É assim que uma solução deixa de ser apenas uma tela bonita e passa a gerar valor continuamente.",
    category: "Produto digital",
    sourceName: "Avenori",
    sourceUrl: "https://avenori.com.br",
    published: true,
    publishedAt: "2026-07-20T10:00:00.000Z",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "avenori-design",
    slug: "design-bonito-nao-basta",
    title: "Design bonito não basta: experiência precisa gerar resultado",
    excerpt: "Estética atrai atenção, mas clareza, velocidade e utilidade são o que fazem as pessoas permanecerem.",
    content: "A aparência importa porque comunica cuidado e posicionamento. Mas um produto não pode depender somente dela. Se o usuário não entende o próximo passo, demora para concluir uma tarefa ou não percebe valor, o visual sozinho não sustenta a experiência.\n\nDesign de produto conecta necessidades humanas a objetivos de negócio. Hierarquia, conteúdo, acessibilidade e resposta da interface precisam funcionar como um sistema. Cada escolha deve ajudar o usuário a avançar com confiança.\n\nO resultado é uma experiência que parece simples porque a complexidade foi tratada durante o processo — e não transferida para quem usa.",
    category: "Design",
    sourceName: "Avenori",
    sourceUrl: "https://avenori.com.br",
    published: true,
    publishedAt: "2026-07-19T10:00:00.000Z",
    createdAt: "2026-07-19T10:00:00.000Z",
  },
  {
    id: "avenori-ia",
    slug: "inteligencia-artificial-com-proposito",
    title: "Inteligência artificial com propósito nos negócios",
    excerpt: "Antes de adotar IA, vale encontrar tarefas repetitivas e decisões que realmente ganham com contexto e automação.",
    content: "A inteligência artificial entrega mais valor quando começa por um problema concreto. Automatizar por tendência costuma criar ferramentas que impressionam na demonstração, mas pouco ajudam na rotina.\n\nMapear tarefas repetitivas, gargalos de informação e decisões demoradas revela oportunidades melhores. A partir daí, é possível definir métricas, controlar riscos e combinar automação com supervisão humana.\n\nTecnologia com propósito não substitui estratégia. Ela amplia a capacidade de executar uma estratégia bem definida.",
    category: "Inteligência artificial",
    sourceName: "Avenori",
    sourceUrl: "https://avenori.com.br",
    published: true,
    publishedAt: "2026-07-18T10:00:00.000Z",
    createdAt: "2026-07-18T10:00:00.000Z",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function supabaseHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`;
  return headers;
}

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
}

export async function getPublishedPosts(limit = 20): Promise<BlogPost[]> {
  if (!supabaseUrl || !supabaseKey) return seedPosts.slice(0, limit);
  const url = `${supabaseUrl}/rest/v1/blog_posts?published=eq.true&select=*&order=published_at.desc&limit=${limit}`;
  const response = await fetch(url, { headers: supabaseHeaders(supabaseKey), cache: "no-store" });
  if (!response.ok) return seedPosts.slice(0, limit);
  const rows = await response.json();
  return rows.map(fromRow);
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const fallback = seedPosts.find((post) => post.slug === slug);
  if (!supabaseUrl || !supabaseKey) return fallback;
  const url = `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=*&limit=1`;
  const response = await fetch(url, { headers: supabaseHeaders(supabaseKey), cache: "no-store" });
  if (!response.ok) return fallback;
  const [row] = await response.json();
  return row ? fromRow(row) : fallback;
}

export function fromRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), excerpt: String(row.excerpt),
    content: String(row.content), category: String(row.category), sourceName: String(row.source_name),
    sourceUrl: String(row.source_url), imageUrl: row.image_url ? String(row.image_url) : null,
    published: Boolean(row.published), publishedAt: String(row.published_at), createdAt: String(row.created_at),
  };
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}