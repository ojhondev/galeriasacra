@AGENTS.md

# Galeria Sacra

E-commerce de arte sacra (foco inicial em quadros, com plano de expandir para outros
produtos sacros), com a marca "Galeria Sacra" (logos em `public/logo-galeriasacra-terracota.png`
e `public/logo-galeriasacra-preta.png`; a versão terracota é a usada no menu). Design
idêntico ao estilo ARTU (artu.works): galeria em papel branco, tipografia única
(Helvetica/grotesco, peso 400, all-caps em nav/footer com tracking positivo), zero radius,
hairlines pretas, e um único bloco de cor (`--color-brand`, `#de2f17`) reservado para a
faixa do rodapé e destaques pontuais.

## Estado atual

- Catálogo, preços e etiquetas de desconto vivem em Postgres (Neon), acessados via Drizzle
  (`src/db/schema.ts`, `src/lib/products.ts`, `src/lib/etiquetas.ts`) — não é mais mockado.
- Login/cadastro de cliente e painel `/admin` (produtos + etiquetas de desconto) com
  autenticação por sessão (cookie JWT via `jose`, senha com `bcryptjs`), protegido por
  `src/middleware.ts` (role `admin`).
- Imagens de produto ainda são placeholders (gradientes via `ArtPlate`), até termos
  fotografia real das obras — trocar por fotos reais é substituir `ArtPlate` por
  `next/image` nos pontos de uso (ver `ProductCard`, `ProdutoGaleria`, `Customizer`).
- Carrinho é client-side (Context + localStorage), sem checkout/pagamento real — "Comprar
  Agora"/"Adicionar ao Carrinho" só adicionam ao carrinho local, sem gateway de pagamento.
- "Monte Seu Quadro" permite escolher uma imagem do catálogo ou enviar imagem própria
  (preview local no navegador, sem upload para servidor ainda).
- "Testar no Meu Ambiente" (AR simples, sem IA): abre a câmera do dispositivo e sobrepõe o
  quadro configurado como um elemento arrastável/redimensionável/rotacionável (arraste com
  um dedo move, pinça com dois dedos gira e redimensiona) sobre o vídeo ao vivo, com tutorial
  de 3 passos na primeira vez e captura de foto (canvas → PNG).

## Próximos passos sugeridos

- Substituir imagens placeholder por fotografia real dos quadros (idealmente frente + verso,
  para o giro na PDP/AR fazer sentido com fotos reais).
- Gateway de pagamento real (ex.: Mercado Pago/Stripe) no lugar do mock de checkout.
- Tela de "esqueci/trocar senha" para o admin.

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
