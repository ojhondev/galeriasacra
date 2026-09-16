import { config } from "dotenv";
config({ path: ".env.local" });

import { produtos, usuarios } from "./schema";
import bcrypt from "bcryptjs";

const PRODUTOS_SEED = [
  {
    sku: "ART-SAGRADA-FAMILIA",
    slug: "sagrada-familia",
    nome: "Sagrada Família",
    categoria: "Quadros Religiosos",
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
  },
  {
    sku: "ART-NS-APARECIDA",
    slug: "nossa-senhora-aparecida",
    nome: "Nossa Senhora Aparecida",
    categoria: "Ícones Marianos",
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
  },
  {
    sku: "ART-ULTIMA-CEIA",
    slug: "ultima-ceia",
    nome: "Última Ceia",
    categoria: "Quadros Religiosos",
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
  },
  {
    sku: "ART-CRISTO-RESSUSCITADO",
    slug: "cristo-ressuscitado",
    nome: "Cristo Ressuscitado",
    categoria: "Quadros Religiosos",
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
  },
  {
    sku: "ART-SAO-FRANCISCO",
    slug: "sao-francisco-de-assis",
    nome: "São Francisco de Assis",
    categoria: "Santos",
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
  },
  {
    sku: "ART-DIVINA-MISERICORDIA",
    slug: "divina-misericordia",
    nome: "Divina Misericórdia",
    categoria: "Quadros Religiosos",
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
  },
  {
    sku: "ART-NS-FATIMA",
    slug: "nossa-senhora-de-fatima",
    nome: "Nossa Senhora de Fátima",
    categoria: "Ícones Marianos",
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
  },
  {
    sku: "ART-SAGRADO-CORACAO",
    slug: "sagrado-coracao-de-jesus",
    nome: "Sagrado Coração de Jesus",
    categoria: "Quadros Religiosos",
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
  },
];

async function seed() {
  const { db } = await import("./index");

  for (const produto of PRODUTOS_SEED) {
    await db.insert(produtos).values(produto).onConflictDoNothing({ target: produtos.slug });
  }
  console.log(`Produtos: ${PRODUTOS_SEED.length} inseridos (ou já existentes).`);

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
