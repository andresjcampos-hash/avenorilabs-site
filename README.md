# Avenori — Site institucional

Site institucional e portfólio da Avenori, desenvolvido com Next.js 16, TypeScript e Tailwind CSS.

## Abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra a pasta `avenori-site` no VS Code.
3. Abra o terminal integrado.
4. Instale as dependências:

```bash
npm install
```

5. Inicie o projeto:

```bash
npm run dev
```

6. Acesse `http://localhost:3000`.

## Verificar antes da publicação

```bash
npm run build
```

## Publicar na Vercel

### Pelo terminal

```bash
npm install -g vercel
vercel
vercel --prod
```

Na primeira publicação, confirme a criação de um novo projeto e mantenha as configurações detectadas para Next.js.

### Pelo GitHub

1. Crie um repositório no GitHub e envie esta pasta.
2. Na Vercel, escolha **Add New > Project**.
3. Importe o repositório.
4. Confirme o framework **Next.js** e publique.

## Arquivos principais

- `app/page.tsx`: conteúdo e estrutura da página.
- `app/globals.css`: identidade visual, responsividade e animações.
- `app/layout.tsx`: metadados, idioma e fontes.
- `public/favicon.svg`: ícone do navegador.

## Antes da versão definitiva

Revise o e-mail `contato@avenori.com.br` em `app/page.tsx` e acrescente os links oficiais do NutriGuest e do Juraxis quando estiverem disponíveis.
