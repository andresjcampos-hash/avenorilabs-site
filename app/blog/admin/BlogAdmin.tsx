"use client";
import { useState } from "react";

type Row = { id: string; title: string; excerpt: string; source_name: string; source_url: string; category: string; published: boolean; created_at: string };

export default function BlogAdmin() {
  const [token, setToken] = useState(""); const [posts, setPosts] = useState<Row[]>([]); const [message, setMessage] = useState("Informe o token editorial para visualizar os conteúdos.");
  async function load() { const res = await fetch("/api/blog/admin", { headers: { "x-blog-token": token } }); const data = await res.json(); if (!res.ok) return setMessage(data.error || "Não foi possível entrar."); setPosts(data); setMessage(`${data.length} conteúdo(s) encontrado(s).`); }
  async function update(id: string, published: boolean) { await fetch("/api/blog/admin", { method: "PATCH", headers: { "Content-Type": "application/json", "x-blog-token": token }, body: JSON.stringify({ id, published }) }); await load(); }
  async function remove(id: string) { if (!confirm("Excluir este conteúdo definitivamente?")) return; await fetch(`/api/blog/admin?id=${id}`, { method: "DELETE", headers: { "x-blog-token": token } }); await load(); }
  return <main className="admin-page"><section><a className="wordmark" href="/">Avenori<span>.</span></a><p className="eyebrow">Revisão editorial</p><h1>Conteúdos do blog</h1><div className="admin-login"><input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token editorial" onKeyDown={(e) => e.key === "Enter" && load()} /><button onClick={load}>Acessar</button></div><small>{message}</small></section>
    <div className="admin-posts">{posts.map((post) => <article key={post.id}><div><span>{post.category}</span><b className={post.published ? "live" : "draft"}>{post.published ? "Publicado" : "Rascunho"}</b></div><h2>{post.title}</h2><p>{post.excerpt}</p><a href={post.source_url} target="_blank" rel="noreferrer">Fonte: {post.source_name} ↗</a><footer><button onClick={() => update(post.id, !post.published)}>{post.published ? "Voltar para rascunho" : "Aprovar e publicar"}</button><button className="danger" onClick={() => remove(post.id)}>Excluir</button></footer></article>)}</div>
  </main>;
}
