CREATE TYPE "public"."status_pedido" AS ENUM('aguardando_pagamento', 'pago', 'em_producao', 'enviado', 'concluido', 'cancelado');--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"itens" jsonb NOT NULL,
	"total" integer NOT NULL,
	"status" "status_pedido" DEFAULT 'aguardando_pagamento' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pedidos_numero_unique" UNIQUE("numero")
);
