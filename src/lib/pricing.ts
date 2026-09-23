// Multiplicadores proporcionais à área (m²) de cada tamanho em relação ao 40×60 (base),
// para acompanhar o custo por m² cobrado pelo fornecedor com a mesma margem em qualquer tamanho.
export const TAMANHOS = [
  { id: "30x40", label: "30 × 40 cm", multiplicador: 0.5 },
  { id: "40x60", label: "40 × 60 cm", multiplicador: 1 },
  { id: "50x70", label: "50 × 70 cm", multiplicador: 1.4583 },
  { id: "60x90", label: "60 × 90 cm", multiplicador: 2.25 },
  { id: "80x120", label: "80 × 120 cm", multiplicador: 4 },
] as const;

export const MOLDURAS = [
  { id: "provencal", label: "Moldura Provençal", adicional: 119, cor: "#ede6d6" },
  { id: "dourada-lisa", label: "Moldura Dourada Lisa", adicional: 99, cor: "#c9a227" },
  { id: "madeira-lisa", label: "Moldura Madeira Lisa", adicional: 99, cor: "#8a5a35" },
  { id: "dourada-floral", label: "Moldura Dourada Floral", adicional: 189, cor: "#b8860b" },
  { id: "madeira-classica", label: "Moldura Madeira Clássica", adicional: 149, cor: "#6b4226" },
  { id: "dourada-classica", label: "Moldura Dourada Clássica", adicional: 149, cor: "#a8791f" },
] as const;

/** Toda tela sai emoldurada — usada como escolha padrão em seletores e como chave da foto principal do produto. */
export const MOLDURA_PADRAO = MOLDURAS[0].id;

export const MATERIAIS = [{ id: "tela-canvas", label: "Tela Canvas — 100% Algodão", multiplicador: 1 }] as const;

/** Único material vendido hoje — mantido como função para se materiais voltarem a ser escolhíveis. */
export const MATERIAL_PADRAO = MATERIAIS[0].id;

export type TamanhoId = (typeof TAMANHOS)[number]["id"];
export type MolduraId = (typeof MOLDURAS)[number]["id"];
export type MaterialId = (typeof MATERIAIS)[number]["id"];

export function calcularPrecoComMultiplicador(
  precoBase: number,
  multiplicadorTamanho: number,
  molduraId: MolduraId,
  materialId: MaterialId,
): number {
  const moldura = MOLDURAS.find((m) => m.id === molduraId) ?? MOLDURAS[0];
  const material = MATERIAIS.find((m) => m.id === materialId) ?? MATERIAIS[0];

  const preco = precoBase * multiplicadorTamanho * material.multiplicador + moldura.adicional;
  return Math.round(preco);
}

export function calcularPreco(
  precoBase: number,
  tamanhoId: TamanhoId,
  molduraId: MolduraId,
  materialId: MaterialId,
): number {
  const tamanho = TAMANHOS.find((t) => t.id === tamanhoId) ?? TAMANHOS[1];
  return calcularPrecoComMultiplicador(precoBase, tamanho.multiplicador, molduraId, materialId);
}

export function precoRange(precoBase: number): { min: number; max: number } {
  const multiplicadoresTamanho = TAMANHOS.map((t) => t.multiplicador);
  const multiplicadoresMaterial = MATERIAIS.map((m) => m.multiplicador);
  const adicionaisMoldura = MOLDURAS.map((m) => m.adicional);

  const min =
    precoBase * Math.min(...multiplicadoresTamanho) * Math.min(...multiplicadoresMaterial) +
    Math.min(...adicionaisMoldura);
  const max =
    precoBase * Math.max(...multiplicadoresTamanho) * Math.max(...multiplicadoresMaterial) +
    Math.max(...adicionaisMoldura);

  return { min: Math.round(min), max: Math.round(max) };
}

export function aplicarDesconto(
  preco: number,
  etiqueta: { tipo: "percentual" | "fixo"; valor: number },
): number {
  const resultado =
    etiqueta.tipo === "percentual" ? preco * (1 - etiqueta.valor / 100) : preco - etiqueta.valor;
  return Math.max(0, Math.round(resultado));
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
