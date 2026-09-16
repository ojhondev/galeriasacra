# Artusa

E-commerce de arte sacra — quadros religiosos prontos e sob encomenda, com personalização
completa ("Monte Seu Quadro"). Estilo visual baseado em [artu.works](https://artu.works):
galeria em papel branco, tipografia única em all-caps, hairlines pretas e uma única faixa
de cor (`#de2f17`) no rodapé.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Estado de carrinho client-side (Context + localStorage) — sem backend ainda

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura

- `src/app` — rotas (home, `/quadros`, `/quadros/[slug]`, `/monte-seu-quadro`, `/sobre`,
  `/contato`, `/carrinho`, `/trocas-e-devolucoes`)
- `src/components` — Nav, Footer, ArtPlate (placeholder de imagem), ProductCard,
  HeroCarousel, Customizer (seletor de tamanho/moldura/material)
- `src/lib` — catálogo mockado (`products.ts`), regra de preço (`pricing.ts`) e carrinho
  (`cart.tsx`)

Ver [CLAUDE.md](./CLAUDE.md) para o estado atual do projeto e próximos passos.
