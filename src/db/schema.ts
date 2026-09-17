import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["cliente", "admin"]);
export const orientacaoEnum = pgEnum("orientacao", ["retrato", "paisagem", "quadrado"]);
export const descontoTipoEnum = pgEnum("desconto_tipo", ["percentual", "fixo"]);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  role: roleEnum("role").notNull().default("cliente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const produtos = pgTable("produtos", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  descricaoCurta: text("descricao_curta").notNull(),
  descricaoLonga: text("descricao_longa").array().notNull(),
  precoBase: integer("preco_base").notNull(),
  orientacao: orientacaoEnum("orientacao").notNull().default("retrato"),
  hue: integer("hue").notNull().default(200),
  ativo: boolean("ativo").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  estoque: integer("estoque").notNull().default(10),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const etiquetasDesconto = pgTable("etiquetas_desconto", {
  id: uuid("id").defaultRandom().primaryKey(),
  produtoId: uuid("produto_id").references(() => produtos.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  tipo: descontoTipoEnum("tipo").notNull().default("percentual"),
  valor: integer("valor").notNull(),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const etiquetasInfo = pgTable("etiquetas_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  produtoId: uuid("produto_id").references(() => produtos.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const avaliacoes = pgTable("avaliacoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  produtoId: uuid("produto_id")
    .notNull()
    .references(() => produtos.id, { onDelete: "cascade" }),
  nomeCliente: text("nome_cliente").notNull(),
  nota: integer("nota").notNull(),
  comentario: text("comentario").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const produtosRelations = relations(produtos, ({ many }) => ({
  etiquetas: many(etiquetasDesconto),
  etiquetasInfo: many(etiquetasInfo),
  avaliacoes: many(avaliacoes),
}));

export const etiquetasDescontoRelations = relations(etiquetasDesconto, ({ one }) => ({
  produto: one(produtos, {
    fields: [etiquetasDesconto.produtoId],
    references: [produtos.id],
  }),
}));

export const etiquetasInfoRelations = relations(etiquetasInfo, ({ one }) => ({
  produto: one(produtos, {
    fields: [etiquetasInfo.produtoId],
    references: [produtos.id],
  }),
}));

export const avaliacoesRelations = relations(avaliacoes, ({ one }) => ({
  produto: one(produtos, {
    fields: [avaliacoes.produtoId],
    references: [produtos.id],
  }),
}));
