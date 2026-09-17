"use client";

const KEY = "galeriasacra:produto-visto";

export type ProdutoVisto = { nome: string; slug: string };

export function registrarProdutoVisto(produto: ProdutoVisto) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(produto));
  } catch {
    // ignora storage indisponível
  }
}

export function obterProdutoVisto(): ProdutoVisto | null {
  try {
    const bruto = window.localStorage.getItem(KEY);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}
