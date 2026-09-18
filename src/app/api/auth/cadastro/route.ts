import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { hashSenha } from "@/lib/senha";
import { criarSessao } from "@/lib/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const redirectPara = String(formData.get("redirect") ?? "/") || "/";

  function erroPara(codigo: string) {
    const url = new URL("/cadastro", request.url);
    url.searchParams.set("erro", codigo);
    url.searchParams.set("redirect", redirectPara);
    return NextResponse.redirect(url, { status: 303 });
  }

  if (!nome || !email || senha.length < 6) {
    return erroPara("invalido");
  }

  const existente = await db.query.usuarios.findFirst({ where: eq(usuarios.email, email) });
  if (existente) {
    return erroPara("duplicado");
  }

  const senhaHash = await hashSenha(senha);
  const [usuario] = await db
    .insert(usuarios)
    .values({ nome, email, whatsapp: whatsapp || null, senhaHash, role: "cliente" })
    .returning();

  await criarSessao({ userId: usuario.id, email: usuario.email, nome: usuario.nome, role: usuario.role });
  return NextResponse.redirect(new URL(redirectPara, request.url), { status: 303 });
}
