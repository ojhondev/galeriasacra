import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { produtos as produtosTable } from "@/db/schema";

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
  };
}

export async function listarProdutos(): Promise<Produto[]> {
  const rows = await db.query.produtos.findMany({
    where: eq(produtosTable.ativo, true),
    orderBy: [asc(produtosTable.ordem), asc(produtosTable.createdAt)],
  });
  return rows.map(paraProduto);
}

export async function listarProdutosAdmin(): Promise<Produto[]> {
  const rows = await db.query.produtos.findMany({
    orderBy: [asc(produtosTable.ordem), asc(produtosTable.createdAt)],
  });
  return rows.map(paraProduto);
}

export async function getProdutoBySlug(slug: string): Promise<Produto | undefined> {
  const row = await db.query.produtos.findFirst({ where: eq(produtosTable.slug, slug) });
  return row ? paraProduto(row) : undefined;
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
