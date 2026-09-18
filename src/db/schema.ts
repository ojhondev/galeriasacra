import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["cliente", "admin"]);
export const orientacaoEnum = pgEnum("orientacao", ["retrato", "paisagem", "quadrado"]);
export const descontoTipoEnum = pgEnum("desconto_tipo", ["percentual", "fixo"]);
export const statusPedidoEnum = pgEnum("status_pedido", [
  "aguardando_pagamento",
  "pago",
  "em_producao",
  "enviado",
  "concluido",
  "cancelado",
]);
export const statusRestauroEnum = pgEnum("status_restauro", [
  "novo",
  "em_analise",
  "orcamento_enviado",
  "aprovado",
  "recusado",
]);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  whatsapp: text("whatsapp"),
  senhaHash: text("senha_hash").notNull(),
  role: roleEnum("role").notNull().default("cliente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const colecoes = pgTable("colecoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull().unique(),
  slug: text("slug").notNull().unique(),
  imagemUrl: text("imagem_url").notNull().default("/categorias/teste-generico.jpg"),
  ordem: integer("ordem").notNull().default(0),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  whatsapp: text("whatsapp").notNull(),
  origem: text("origem").notNull().default("popup"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const faixasFrete = pgTable("faixas_frete", {
  id: uuid("id").defaultRandom().primaryKey(),
  prefixoCep: text("prefixo_cep").notNull().unique(),
  regiao: text("regiao").notNull(),
  prazo: text("prazo").notNull(),
  valor: integer("valor").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lojaConfig = pgTable("loja_config", {
  id: text("id").primaryKey().default("default"),
  freteGratisMinimo: integer("frete_gratis_minimo").notNull().default(400),
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
  imagens: jsonb("imagens").notNull().default({}).$type<Record<string, string>>(),
  ativo: boolean("ativo").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  estoque: integer("estoque").notNull().default(10),
  prazoEntregaDias: integer("prazo_entrega_dias").notNull().default(4),
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

export const pedidos = pgTable("pedidos", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: text("numero").notNull().unique(),
  itens: jsonb("itens").notNull().$type<
    { nome: string; tamanhoLabel: string; molduraLabel: string; materialLabel: string; quantidade: number; precoUnitario: number }[]
  >(),
  total: integer("total").notNull(),
  status: statusPedidoEnum("status").notNull().default("aguardando_pagamento"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const solicitacoesRestauro = pgTable("solicitacoes_restauro", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: text("numero").notNull().unique(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  tipoObra: text("tipo_obra").notNull(),
  largura: integer("largura"),
  altura: integer("altura"),
  tiposDano: text("tipos_dano").array().notNull(),
  descricao: text("descricao").notNull().default(""),
  urgencia: text("urgencia").notNull(),
  quantidadeFotos: integer("quantidade_fotos").notNull().default(0),
  status: statusRestauroEnum("status").notNull().default("novo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pushInscricoes = pgTable("push_inscricoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  produtoVistoNome: text("produto_visto_nome"),
  produtoVistoSlug: text("produto_visto_slug"),
  notificadoEm: timestamp("notificado_em"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const pushInscricoesRelations = relations(pushInscricoes, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [pushInscricoes.usuarioId],
    references: [usuarios.id],
  }),
}));
