# Galeria Sacra

E-commerce de arte sacra — quadros religiosos prontos e sob encomenda, com personalização
completa ("Monte Seu Quadro"). Estilo visual baseado em [artu.works](https://artu.works):
galeria em papel branco, tipografia única em all-caps, hairlines pretas e uma única faixa
de cor (`#de2f17`) no rodapé.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Postgres (Neon) + Drizzle ORM
- Autenticação por sessão (cookie JWT via `jose`, senha com `bcryptjs`)
- Estado de carrinho client-side (Context + localStorage) — checkout ainda é mock

## Rodando localmente

```bash
npm install
npm run dev
```

Variáveis de ambiente em `.env.local` (não versionado): `DATABASE_URL`,
`DATABASE_URL_UNPOOLED`, `AUTH_SECRET`.

```bash
npm run db:generate   # gera migração a partir do schema
npm run db:migrate    # aplica migração no banco
npm run db:seed       # popula produtos + usuário admin inicial
npm run db:studio     # abre o Drizzle Studio
```

## Estrutura

- `src/app` — rotas (home, `/quadros`, `/quadros/[slug]`, `/monte-seu-quadro`, `/sobre`,
  `/contato`, `/carrinho`, `/trocas-e-devolucoes`, `/login`, `/cadastro`, `/admin`)
- `src/components` — Nav, Footer, ArtPlate (placeholder de imagem), ProductCard,
  Hero, VideoParallax, Customizer (seletor de tamanho/moldura/material), ARPreview
  (Testar no Meu Ambiente), componentes de `admin/`
- `src/lib` — catálogo (`products.ts`, lê do banco), regra de preço (`pricing.ts`),
  etiquetas de desconto (`etiquetas.ts`), carrinho (`cart.tsx`), sessão/senha
  (`session.ts`, `senha.ts`), server actions (`auth-actions.ts`, `admin-actions.ts`)
- `src/db` — schema Drizzle (`schema.ts`), client (`index.ts`), seed (`seed.ts`)

Ver [CLAUDE.md](./CLAUDE.md) para o estado atual do projeto e próximos passos.
