CREATE TYPE "public"."status_restauro" AS ENUM('novo', 'em_analise', 'orcamento_enviado', 'aprovado', 'recusado');--> statement-breakpoint
CREATE TABLE "solicitacoes_restauro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"tipo_obra" text NOT NULL,
	"largura" integer,
	"altura" integer,
	"tipos_dano" text[] NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"urgencia" text NOT NULL,
	"quantidade_fotos" integer DEFAULT 0 NOT NULL,
	"status" "status_restauro" DEFAULT 'novo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "solicitacoes_restauro_numero_unique" UNIQUE("numero")
);
