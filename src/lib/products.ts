import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { produtos as produtosTable } from "@/db/schema";
import { listarEtiquetasInfoAtivas } from "@/lib/etiquetas";

export type Orientacao = "retrato" | "paisagem" | "quadrado";

export type Produto = {
  id: string;
  sku: string;
  slug: string;
  nome: string;
  categoria: string;
  descricaoCurta: string;
  descricaoLonga: string[];
  precoBase: number;
  orientacao: Orientacao;
  hue: number;
  ativo: boolean;
  estoque: number;
  etiquetasInfo: string[];
};

function paraProduto(row: typeof produtosTable.$inferSelect): Produto {
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    nome: row.nome,
    categoria: row.categoria,
    descricaoCurta: row.descricaoCurta,
    descricaoLonga: row.descricaoLonga,
    precoBase: row.precoBase,
    orientacao: row.orientacao,
    hue: row.hue,
    ativo: row.ativo,
    estoque: row.estoque,
    etiquetasInfo: [],
  };
}

async function anexarEtiquetasInfo(produtosLista: Produto[]): Promise<Produto[]> {
  const etiquetasAtivas = await listarEtiquetasInfoAtivas();
  const globais = etiquetasAtivas.filter((e) => !e.produtoId).map((e) => e.label);
  const porProduto = new Map<string, string[]>();
  for (const etiqueta of etiquetasAtivas) {
    if (!etiqueta.produtoId) continue;
    const lista = porProduto.get(etiqueta.produtoId) ?? [];
    lista.push(etiqueta.label);
    porProduto.set(etiqueta.produtoId, lista);
  }
  return produtosLista.map((produto) => ({
    ...produto,
    etiquetasInfo: [...globais, ...(porProduto.get(produto.id) ?? [])],
  }));
}

export async function listarProdutos(): Promise<Produto[]> {
  const rows = await db.query.produtos.findMany({
    where: eq(produtosTable.ativo, true),
    orderBy: [asc(produtosTable.ordem), asc(produtosTable.createdAt)],
  });
  return anexarEtiquetasInfo(rows.map(paraProduto));
}

export async function listarProdutosAdmin(): Promise<Produto[]> {
  const rows = await db.query.produtos.findMany({
    orderBy: [asc(produtosTable.ordem), asc(produtosTable.createdAt)],
  });
  return rows.map(paraProduto);
}

export async function getProdutoBySlug(slug: string): Promise<Produto | undefined> {
  const row = await db.query.produtos.findFirst({ where: eq(produtosTable.slug, slug) });
  if (!row) return undefined;
  const [produto] = await anexarEtiquetasInfo([paraProduto(row)]);
  return produto;
}

export async function getProdutoPorId(id: string): Promise<Produto | undefined> {
  const row = await db.query.produtos.findFirst({ where: eq(produtosTable.id, id) });
  return row ? paraProduto(row) : undefined;
}

export type ProdutoInput = {
  sku: string;
  slug: string;
  nome: string;
  categoria: string;
  descricaoCurta: string;
  descricaoLonga: string[];
  precoBase: number;
  orientacao: Orientacao;
  hue: number;
  ativo: boolean;
  estoque: number;
};

export async function criarProduto(dados: ProdutoInput) {
  const [row] = await db.insert(produtosTable).values(dados).returning();
  return paraProduto(row);
}

export async function atualizarProduto(id: string, dados: ProdutoInput) {
  const [row] = await db
    .update(produtosTable)
    .set({ ...dados, updatedAt: new Date() })
    .where(eq(produtosTable.id, id))
    .returning();
  return row ? paraProduto(row) : undefined;
}

export async function excluirProduto(id: string) {
  await db.delete(produtosTable).where(eq(produtosTable.id, id));
}
