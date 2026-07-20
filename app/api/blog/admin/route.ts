import { NextRequest, NextResponse } from "next/server";

function authorized(request: NextRequest) { return Boolean(process.env.BLOG_ADMIN_TOKEN) && request.headers.get("x-blog-token") === process.env.BLOG_ADMIN_TOKEN; }
function config() { return { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY }; }
function headers(key: string): Record<string, string> { const value: Record<string, string> = { apikey: key }; if (!key.startsWith("sb_")) value.Authorization = `Bearer ${key}`; return value; }

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const { url, key } = config();
  if (!url || !key) return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });
  const response = await fetch(`${url}/rest/v1/blog_posts?select=*&order=created_at.desc`, { headers: headers(key), cache: "no-store" });
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const { id, published } = await request.json();
  const { url, key } = config();
  if (!url || !key || !id) return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  const response = await fetch(`${url}/rest/v1/blog_posts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { ...headers(key), "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ published: Boolean(published), published_at: new Date().toISOString() }) });
  return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : response.status });
}

export async function DELETE(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  const { url, key } = config();
  if (!url || !key || !id) return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  const response = await fetch(`${url}/rest/v1/blog_posts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: headers(key) });
  return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : response.status });
}