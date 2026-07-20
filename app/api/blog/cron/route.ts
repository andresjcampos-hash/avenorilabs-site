import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/blog";

export const dynamic = "force-dynamic";

const feeds = [
  { category: "Inteligência artificial", url: "https://news.google.com/rss/search?q=intelig%C3%AAncia+artificial+tecnologia&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
  { category: "Tecnologia", url: "https://news.google.com/rss/search?q=tecnologia+produtos+digitais&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
  { category: "Negócios digitais", url: "https://news.google.com/rss/search?q=inova%C3%A7%C3%A3o+neg%C3%B3cios+digitais&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
];

function decodeXml(value: string) {
  return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function tag(xml: string, name: string) {
  return decodeXml(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] || "");
}

async function createOriginalSummary(title: string, source: string, description: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { excerpt: description.slice(0, 260), content: `Esta notícia foi selecionada automaticamente pela curadoria Avenori. ${description}\n\nA publicação permanece como rascunho até passar por revisão editorial. Consulte a matéria original para conhecer todos os detalhes e o contexto.` };
  const prompt = `Você é editor do blog da Avenori. Com base somente nestes dados, escreva em português brasileiro sem inventar fatos. Produza JSON válido com "excerpt" (até 220 caracteres) e "content" (3 parágrafos curtos, texto simples). Não copie frases literalmente. Título: ${title}. Fonte: ${source}. Informação disponível: ${description}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.35 } }) });
  if (!response.ok) throw new Error("Não foi possível gerar o resumo editorial.");
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
      candidates.push({ title, sourceName, sourceUrl: tag(item, "link"), description: tag(item, "description") || title, category: feed.category });
    }
  }

  let imported = 0;
  const headers = { apikey: serviceKey, ...(serviceKey.startsWith("sb_") ? {} : { Authorization: `Bearer ${serviceKey}` }), "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" };
  for (const candidate of candidates.slice(0, 5)) {
    try {
      const summary = await createOriginalSummary(candidate.title, candidate.sourceName, candidate.description);
      const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?on_conflict=source_url`, { method: "POST", headers, body: JSON.stringify({ slug: `${slugify(candidate.title)}-${Date.now().toString(36).slice(-4)}`, title: candidate.title, excerpt: summary.excerpt, content: summary.content, category: candidate.category, source_name: candidate.sourceName, source_url: candidate.sourceUrl, published: false, published_at: new Date().toISOString() }) });
      if (response.ok) imported++;
    } catch (error) { console.error(error); }
  }
  return NextResponse.json({ ok: true, imported, status: "Os novos conteúdos aguardam aprovação." });
}