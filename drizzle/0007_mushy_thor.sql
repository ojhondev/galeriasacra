CREATE TABLE "colecoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"imagem_url" text DEFAULT '/categorias/teste-generico.jpg' NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "colecoes_nome_unique" UNIQUE("nome"),
	CONSTRAINT "colecoes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faixas_frete" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prefixo_cep" text NOT NULL,
	"regiao" text NOT NULL,
	"prazo" text NOT NULL,
	"valor" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faixas_frete_prefixo_cep_unique" UNIQUE("prefixo_cep")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"origem" text DEFAULT 'popup' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "loja_config" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"frete_gratis_minimo" integer DEFAULT 400 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "whatsapp" text;