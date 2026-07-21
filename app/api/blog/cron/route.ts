import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/blog";

export const dynamic = "force-dynamic";

const feeds = [
  { category: "Inteligência artificial", url: "https://news.google.com/rss/search?q=%22intelig%C3%AAncia+artificial%22+tecnologia+-vagas+-emprego+-concurso+-curso&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
  { category: "Produtos digitais", url: "https://news.google.com/rss/search?q=%22produto+digital%22+OR+%22desenvolvimento+de+software%22+-vagas+-emprego+-curso&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
  { category: "Inovação", url: "https://news.google.com/rss/search?q=inova%C3%A7%C3%A3o+tecnologia+neg%C3%B3cios+-vagas+-emprego+-concurso&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
];

const blockedTerms = ["vaga", "vagas", "emprego", "concurso", "processo seletivo", "salário", "bolsa de estudo", "curso grátis", "vestibular", "horóscopo", "galeria", "arquitetura", "decoração", "imóvel"];
const relevantTerms = ["inteligência artificial", "software", "tecnologia", "produto digital", "transformação digital", "inovação", "startup", "cibersegurança", "ciência de dados", "aplicativo", "design digital", "automação", "cloud computing", "computação em nuvem", "plataforma digital"];

function decodeXml(value: string) {
  return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;|&#160;/gi, " ").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#\d+;/g, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalized(value: string) { return ` ${value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()} `; }
function isRelevant(title: string, description: string) {
  const text = normalized(`${title} ${description}`);
  if (blockedTerms.some((term) => text.includes(normalized(term).trim()))) return false;
  return relevantTerms.filter((term) => text.includes(normalized(term).trim())).length >= 2;
}

function tag(xml: string, name: string) {
  return decodeXml(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] || "");
}

async function createOriginalSummary(title: string, source: string, description: string) {
  const key = process.env.GEMINI_API_KEY;
  const cleanDescription = description.replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "").replace(/\s+/g, " ").trim();
  const excerpt = (cleanDescription.length > 45 ? cleanDescription : title).slice(0, 240);
  const fallback = { excerpt, content: `Esta edição do Radar Avenori destaca uma atualização publicada por ${source}: ${excerpt}\n\nO tema foi selecionado por sua relação com tecnologia, inovação e transformação digital. A curadoria automática prioriza assuntos capazes de impactar produtos, empresas e a experiência das pessoas.\n\nPara conhecer os dados completos e o contexto original, consulte a publicação da fonte indicada nesta página.` };
  if (!key) return fallback;
  const prompt = `Você é editor do blog da Avenori. Com base somente nestes dados, escreva em português brasileiro sem inventar fatos. Produza JSON válido com "excerpt" (até 220 caracteres) e "content" (3 parágrafos curtos, texto simples). Não copie frases literalmente. Título: ${title}. Fonte: ${source}. Informação disponível: ${description}`;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.35 } }) });
  if (!response.ok) { console.warn(`Gemini indisponível (${response.status}); usando resumo provisório.`); return fallback; }
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." }, { status: 503 });

  const candidates: Array<{ title: string; sourceName: string; sourceUrl: string; description: string; category: string }> = [];
  for (const feed of feeds) {
    const xml = await fetch(feed.url, { headers: { "User-Agent": "AvenoriBlog/1.0" }, cache: "no-store" }).then((res) => res.text());
    for (const item of xml.match(/<item>[\s\S]*?<\/item>/gi)?.slice(0, 3) || []) {
      const fullTitle = tag(item, "title");
      const titleParts = fullTitle.split(" - ");
      const sourceName = tag(item, "source") || titleParts.at(-1) || "Fonte externa";
      const title = titleParts.length > 1 ? titleParts.slice(0, -1).join(" - ") : fullTitle;
      const description = tag(item, "description") || title;
      const sourceUrl = tag(item, "link");
      if (sourceUrl && isRelevant(title, description) && !candidates.some((candidate) => candidate.title === title)) candidates.push({ title, sourceName, sourceUrl, description, category: feed.category });
    }
  }

  let imported = 0;
  const headers = { apikey: serviceKey, ...(serviceKey.startsWith("sb_") ? {} : { Authorization: `Bearer ${serviceKey}` }), "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=representation" };
  for (const candidate of candidates) {
    if (imported >= 2) break;
    try {
      const summary = await createOriginalSummary(candidate.title, candidate.sourceName, candidate.description);
      const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?on_conflict=source_url`, { method: "POST", headers, body: JSON.stringify({ slug: `${slugify(candidate.title)}-${Date.now().toString(36).slice(-4)}`, title: candidate.title, excerpt: summary.excerpt, content: summary.content, category: candidate.category, source_name: candidate.sourceName, source_url: candidate.sourceUrl, published: true, published_at: new Date().toISOString() }) });
      if (response.ok && (await response.json()).length > 0) imported++;
    } catch (error) { console.error(error); }
  }
  if (imported > 0) {
    revalidatePath("/");
    revalidatePath("/blog");
  }

  return NextResponse.json({ ok: true, imported, status: imported ? "Novos conteúdos publicados automaticamente e páginas atualizadas." : "Nenhum conteúdo novo e relevante encontrado." });
}