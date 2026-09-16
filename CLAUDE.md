@AGENTS.md

# Artusa

E-commerce de arte sacra (foco inicial em quadros, com plano de expandir para outros
produtos sacros), com a marca "Artusa" (logo em `public/logo-artusa.png`). Design
idêntico ao estilo ARTU (artu.works): galeria em papel branco, tipografia única
(Helvetica/grotesco, peso 400, all-caps em nav/footer com tracking positivo), zero radius,
hairlines pretas, e um único bloco de cor (`--color-brand`, `#de2f17`) reservado para a
faixa do rodapé e destaques pontuais. Menu mobile precisa ficar idêntico ao print de
referência do ARTU: logo à esquerda, ícone de hambúrguer à direita, sem links visíveis por
padrão.

## Estado atual (mocked-first)

- Catálogo de produtos e preços em `src/lib/products.ts` / `src/lib/pricing.ts` — dados
  mockados, sem banco de dados ainda.
- Imagens de produto são placeholders (gradientes via `ArtPlate`), até termos fotografia
  real das obras — trocar por fotos reais é só substituir `ArtPlate` por `next/image` nos
  pontos de uso.
- Carrinho é client-side (Context + localStorage), sem checkout/pagamento real — o botão
  "Finalizar pedido" apenas confirma o pedido na tela, sem gateway de pagamento.
- "Monte Seu Quadro" permite escolher uma imagem do catálogo ou enviar imagem própria
  (preview local no navegador, sem upload para servidor ainda).

## Próximos passos sugeridos

- Substituir imagens placeholder por fotografia real dos quadros.
- Banco de dados (Neon + Drizzle) para catálogo, pedidos e upload de imagem própria.
- Gateway de pagamento real (ex.: Mercado Pago/Stripe) no lugar do mock de checkout.

## Git: commit, push e deploy automáticos

Toda alteração de código feita neste projeto (nesta ou em sessões futuras) deve ser
commitada, enviada para o GitHub (`origin/main`) e publicada em produção
automaticamente, sem esperar autorização explícita a cada vez — isso já foi autorizado
pelo usuário.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build normalmente.
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`
5. `npx vercel@latest --prod` — **obrigatório**, não presumir que o push sozinho
   publica a mudança (o auto-deploy nativo da Vercel já falhou silenciosamente neste
   tipo de projeto antes; ver `dev.md` para o histórico).
