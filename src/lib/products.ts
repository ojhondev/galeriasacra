export type Orientacao = "retrato" | "paisagem" | "quadrado";

export type Produto = {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  descricaoCurta: string;
  descricaoLonga: string[];
  precoBase: number;
  orientacao: Orientacao;
  hue: number;
};

export const produtos: Produto[] = [
  {
    id: "sagrada-familia",
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
    orientacao: "retrato",
    hue: 28,
  },
  {
    id: "nossa-senhora-aparecida",
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
    orientacao: "retrato",
    hue: 212,
  },
  {
    id: "ultima-ceia",
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
    orientacao: "paisagem",
    hue: 34,
  },
  {
    id: "cristo-ressuscitado",
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
    orientacao: "retrato",
    hue: 48,
  },
  {
    id: "sao-francisco-de-assis",
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
    orientacao: "retrato",
    hue: 24,
  },
  {
    id: "divina-misericordia",
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
    orientacao: "retrato",
    hue: 4,
  },
  {
    id: "nossa-senhora-de-fatima",
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
    orientacao: "retrato",
    hue: 44,
  },
  {
    id: "sagrado-coracao-de-jesus",
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
    orientacao: "retrato",
    hue: 10,
  },
];

export function getProdutoBySlug(slug: string): Produto | undefined {
  return produtos.find((p) => p.slug === slug);
}
