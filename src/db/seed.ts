import { config } from "dotenv";
config({ path: ".env.local" });

import { eq, isNull, and } from "drizzle-orm";
import { produtos, usuarios, avaliacoes, etiquetasDesconto } from "./schema";
import bcrypt from "bcryptjs";

const ETIQUETAS_SEED: { slug: string | null; label: string; tipo: "percentual" | "fixo"; valor: number }[] = [
  { slug: "sao-francisco-de-assis", label: "OFERTA", tipo: "percentual", valor: 15 },
  { slug: "nossa-senhora-de-fatima", label: "OFERTA", tipo: "percentual", valor: 20 },
  { slug: "cristo-ressuscitado", label: "OFERTA", tipo: "fixo", valor: 40 },
  { slug: null, label: "10% OFF em toda a coleção", tipo: "percentual", valor: 10 },
];

const PRODUTOS_SEED = [
  {
    sku: "ART-SAGRADA-FAMILIA",
    slug: "sagrada-familia",
    nome: "Sagrada Família",
    categoria: "Sagrada Família",
    descricaoCurta: "A união entre José, Maria e o Menino Jesus, em composição serena.",
    descricaoLonga: [
      "Uma releitura contemporânea da Sagrada Família, pensada para ambientes que celebram a união e a fé.",
      "Impressão em alta definição, com fidelidade de cor testada para grandes formatos e longa duração.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 349,
    orientacao: "retrato" as const,
    hue: 28,
    ordem: 0,
    estoque: 3,
  },
  {
    sku: "ART-NS-APARECIDA",
    slug: "nossa-senhora-aparecida",
    nome: "Nossa Senhora Aparecida",
    categoria: "Virgem Maria",
    descricaoCurta: "A padroeira do Brasil, em tons profundos de azul e terracota.",
    descricaoLonga: [
      "Inspirado na iconografia tradicional da Padroeira do Brasil, com paleta de azul mariano e terracota.",
      "Peça best-seller da galeria, presente em capelas, salas e quartos de oração.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 379,
    orientacao: "retrato" as const,
    hue: 212,
    ordem: 1,
    estoque: 8,
  },
  {
    sku: "ART-ULTIMA-CEIA",
    slug: "ultima-ceia",
    nome: "Última Ceia",
    categoria: "Sacramentos e Liturgia",
    descricaoCurta: "Composição horizontal clássica, ideal para salas de jantar.",
    descricaoLonga: [
      "A cena mais icônica da tradição cristã, em formato panorâmico pensado para salas de jantar e recepções.",
      "Detalhamento cuidadoso das figuras, preservado em impressão de alta resolução.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 429,
    orientacao: "paisagem" as const,
    hue: 34,
    ordem: 2,
    estoque: 2,
  },
  {
    sku: "ART-CRISTO-RESSUSCITADO",
    slug: "cristo-ressuscitado",
    nome: "Cristo Ressuscitado",
    categoria: "Vida de Jesus",
    descricaoCurta: "Luz e esperança em uma composição vertical luminosa.",
    descricaoLonga: [
      "Uma composição vertical que trabalha luz e sombra para transmitir esperança e renovação.",
      "Indicado para entradas, escritórios e espaços de oração pessoal.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 359,
    orientacao: "retrato" as const,
    hue: 48,
    ordem: 3,
    estoque: 12,
  },
  {
    sku: "ART-SAO-FRANCISCO",
    slug: "sao-francisco-de-assis",
    nome: "São Francisco de Assis",
    categoria: "Santos e Santas",
    descricaoCurta: "O santo da simplicidade e da natureza, em tons terrosos.",
    descricaoLonga: [
      "Retrato de São Francisco de Assis em paleta terrosa, remetendo à sua devoção pela natureza.",
      "Peça indicada para varandas, jardins internos e espaços de contemplação.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 329,
    orientacao: "retrato" as const,
    hue: 24,
    ordem: 4,
    estoque: 5,
  },
  {
    sku: "ART-DIVINA-MISERICORDIA",
    slug: "divina-misericordia",
    nome: "Divina Misericórdia",
    categoria: "Cristo",
    descricaoCurta: "Os raios vermelho e branco, em composição frontal e imponente.",
    descricaoLonga: [
      "Baseado na imagem revelada a Santa Faustina, com os raios de sangue e água em destaque.",
      "Grande presença visual, recomendado para salas amplas e capelas.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 399,
    orientacao: "retrato" as const,
    hue: 4,
    ordem: 5,
    estoque: 15,
  },
  {
    sku: "ART-NS-FATIMA",
    slug: "nossa-senhora-de-fatima",
    nome: "Nossa Senhora de Fátima",
    categoria: "Virgem Maria",
    descricaoCurta: "Tons claros e dourados, em composição delicada.",
    descricaoLonga: [
      "Paleta clara e dourada que remete às aparições de Fátima, em composição delicada e luminosa.",
      "Indicado para quartos, oratórios e presentes de crisma e casamento.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 349,
    orientacao: "retrato" as const,
    hue: 44,
    ordem: 6,
    estoque: 4,
  },
  {
    sku: "ART-SAGRADO-CORACAO",
    slug: "sagrado-coracao-de-jesus",
    nome: "Sagrado Coração de Jesus",
    categoria: "Cristo",
    descricaoCurta: "Composição clássica em vermelho profundo e dourado.",
    descricaoLonga: [
      "Uma das devoções mais tradicionais da Igreja, revisitada em vermelho profundo e dourado.",
      "Impressão testada para preservar a saturação da cor por anos, mesmo em ambientes iluminados.",
      "Disponível para personalização completa na seção Monte Seu Quadro.",
    ],
    precoBase: 369,
    orientacao: "retrato" as const,
    hue: 10,
    ordem: 7,
    estoque: 20,
  },
];

const AVALIACOES_SEED: Record<string, { nomeCliente: string; nota: number; comentario: string }[]> = {
  "sagrada-familia": [
    { nomeCliente: "Marcos T.", nota: 5, comentario: "Impressão linda, cores fiéis à foto do site. Ficou lindo na sala." },
    { nomeCliente: "Beatriz A.", nota: 5, comentario: "Presente para o casamento dos meus pais, chegou bem embalado e no prazo." },
  ],
  "nossa-senhora-aparecida": [
    { nomeCliente: "Cláudia R.", nota: 5, comentario: "Já é o segundo que compro. Qualidade de impressão impecável." },
    { nomeCliente: "João P.", nota: 4, comentario: "Muito bonito, só achei o frete um pouco caro para minha região." },
  ],
  "ultima-ceia": [
    { nomeCliente: "Fernanda L.", nota: 5, comentario: "Ficou perfeito na sala de jantar, exatamente como eu queria." },
    { nomeCliente: "Ricardo M.", nota: 5, comentario: "Acabamento sob medida superou minhas expectativas." },
  ],
  "cristo-ressuscitado": [
    { nomeCliente: "Patrícia S.", nota: 5, comentario: "Comprei para o consultório, todo mundo elogia." },
    { nomeCliente: "Eduardo N.", nota: 4, comentario: "Muito bom, chegou um pouco depois do prazo mas valeu a pena." },
  ],
  "sao-francisco-de-assis": [
    { nomeCliente: "Luciana F.", nota: 5, comentario: "As cores terrosas ficaram lindas na varanda, como eu imaginei." },
  ],
  "divina-misericordia": [
    { nomeCliente: "Antônio C.", nota: 5, comentario: "Peça grande e imponente, ótimo para a capela da nossa comunidade." },
    { nomeCliente: "Sandra V.", nota: 5, comentario: "Superou expectativas, moldura dourada ficou belíssima." },
  ],
  "nossa-senhora-de-fatima": [
    { nomeCliente: "Isabela G.", nota: 5, comentario: "Dei de presente de crisma, a afilhada amou." },
  ],
  "sagrado-coracao-de-jesus": [
    { nomeCliente: "Paulo H.", nota: 4, comentario: "Muito bonito, impressão de ótima qualidade." },
    { nomeCliente: "Renata B.", nota: 5, comentario: "Já é o terceiro quadro que compro da loja, sempre impecável." },
  ],
};

async function seed() {
  const { db } = await import("./index");

  for (const produto of PRODUTOS_SEED) {
    await db
      .insert(produtos)
      .values(produto)
      .onConflictDoUpdate({ target: produtos.slug, set: { estoque: produto.estoque } });
  }
  console.log(`Produtos: ${PRODUTOS_SEED.length} inseridos/atualizados (estoque sincronizado).`);

  let avaliacoesInseridas = 0;
  for (const [slug, lista] of Object.entries(AVALIACOES_SEED)) {
    const produto = await db.query.produtos.findFirst({ where: eq(produtos.slug, slug) });
    if (!produto) continue;

    const existentes = await db.query.avaliacoes.findMany({ where: eq(avaliacoes.produtoId, produto.id) });
    if (existentes.length > 0) continue;

    for (const avaliacao of lista) {
      await db.insert(avaliacoes).values({ produtoId: produto.id, ...avaliacao });
      avaliacoesInseridas++;
    }
  }
  console.log(`Avaliações: ${avaliacoesInseridas} inseridas.`);

  let etiquetasInseridas = 0;
  for (const etiqueta of ETIQUETAS_SEED) {
    const produtoId = etiqueta.slug
      ? (await db.query.produtos.findFirst({ where: eq(produtos.slug, etiqueta.slug) }))?.id
      : null;
    if (etiqueta.slug && !produtoId) continue;

    const existente = await db.query.etiquetasDesconto.findFirst({
      where: produtoId
        ? eq(etiquetasDesconto.produtoId, produtoId)
        : and(isNull(etiquetasDesconto.produtoId), eq(etiquetasDesconto.label, etiqueta.label)),
    });
    if (existente) continue;

    await db.insert(etiquetasDesconto).values({
      produtoId: produtoId ?? null,
      label: etiqueta.label,
      tipo: etiqueta.tipo,
      valor: etiqueta.valor,
    });
    etiquetasInseridas++;
  }
  console.log(`Etiquetas de desconto: ${etiquetasInseridas} inseridas.`);

  const emailAdmin = "ojhonatanribeiroalves@gmail.com";
  const senhaAdmin = "UMQ211FaKq";
  const senhaHash = await bcrypt.hash(senhaAdmin, 10);

  await db
    .insert(usuarios)
    .values({ nome: "Jhonatan", email: emailAdmin, senhaHash, role: "admin" })
    .onConflictDoNothing({ target: usuarios.email });

  console.log(`Admin: ${emailAdmin} / senha temporária: ${senhaAdmin}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
