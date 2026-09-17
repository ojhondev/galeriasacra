export const CATEGORIAS = [
  "Cristo",
  "Virgem Maria",
  "Vida de Jesus",
  "Paixão de Cristo",
  "Sagrada Família",
  "Santos e Santas",
  "Anjos e Arcanjos",
  "Cenas do Antigo Testamento",
  "Sacramentos e Liturgia",
  "Símbolos e Alegorias Sacras",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

// Imagem provisória compartilhada por todas as categorias — o cliente vai
// enviar a imagem definitiva de cada uma depois.
const IMAGEM_TESTE = "/categorias/teste-generico.jpg";

export const IMAGENS_CATEGORIA: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((categoria) => [categoria, IMAGEM_TESTE]),
);
