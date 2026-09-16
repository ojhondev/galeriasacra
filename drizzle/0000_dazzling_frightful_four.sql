CREATE TYPE "public"."desconto_tipo" AS ENUM('percentual', 'fixo');--> statement-breakpoint
CREATE TYPE "public"."orientacao" AS ENUM('retrato', 'paisagem', 'quadrado');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('cliente', 'admin');--> statement-breakpoint
CREATE TABLE "etiquetas_desconto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"produto_id" uuid,
	"label" text NOT NULL,
	"tipo" "desconto_tipo" DEFAULT 'percentual' NOT NULL,
	"valor" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"descricao_curta" text NOT NULL,
	"descricao_longa" text[] NOT NULL,
	"preco_base" integer NOT NULL,
	"orientacao" "orientacao" DEFAULT 'retrato' NOT NULL,
	"hue" integer DEFAULT 200 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "produtos_sku_unique" UNIQUE("sku"),
	CONSTRAINT "produtos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"role" "role" DEFAULT 'cliente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "etiquetas_desconto" ADD CONSTRAINT "etiquetas_desconto_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;