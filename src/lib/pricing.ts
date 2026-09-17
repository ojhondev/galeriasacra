export const TAMANHOS = [
  { id: "30x40", label: "30 × 40 cm", multiplicador: 0.75 },
  { id: "40x60", label: "40 × 60 cm", multiplicador: 1 },
  { id: "50x70", label: "50 × 70 cm", multiplicador: 1.4 },
  { id: "60x90", label: "60 × 90 cm", multiplicador: 2.1 },
  { id: "80x120", label: "80 × 120 cm", multiplicador: 3.4 },
] as const;

export const MOLDURAS = [
  { id: "sem-moldura", label: "Sem Moldura", adicional: 0, cor: null },
  { id: "preta", label: "Moldura Preta", adicional: 89, cor: "#000000" },
  { id: "madeira", label: "Moldura Madeira Natural", adicional: 129, cor: "#8a5a35" },
  { id: "dourada", label: "Moldura Dourada", adicional: 169, cor: "#b8902f" },
] as const;

export const MATERIAIS = [
  { id: "tela-canvas", label: "Tela Canvas", multiplicador: 1 },
  { id: "papel-fine-art", label: "Papel Fine Art", multiplicador: 0.85 },
  { id: "acrilico", label: "Acrílico", multiplicador: 1.35 },
] as const;

export type TamanhoId = (typeof TAMANHOS)[number]["id"];
export type MolduraId = (typeof MOLDURAS)[number]["id"];
export type MaterialId = (typeof MATERIAIS)[number]["id"];

export function calcularPreco(
  precoBase: number,
  tamanhoId: TamanhoId,
  molduraId: MolduraId,
  materialId: MaterialId,
): number {
  const tamanho = TAMANHOS.find((t) => t.id === tamanhoId) ?? TAMANHOS[1];
  const moldura = MOLDURAS.find((m) => m.id === molduraId) ?? MOLDURAS[0];
  const material = MATERIAIS.find((m) => m.id === materialId) ?? MATERIAIS[0];

  const preco = precoBase * tamanho.multiplicador * material.multiplicador + moldura.adicional;
  return Math.round(preco);
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
