import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { verificarSenha } from "@/lib/senha";
import { criarSessao } from "@/lib/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const redirectPara = String(formData.get("redirect") ?? "/") || "/";

  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.email, email) });
  if (!usuario || !(await verificarSenha(senha, usuario.senhaHash))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("erro", "1");
    url.searchParams.set("redirect", redirectPara);
    return NextResponse.redirect(url, { status: 303 });
  }

  await criarSessao({ userId: usuario.id, email: usuario.email, nome: usuario.nome, role: usuario.role });
  return NextResponse.redirect(new URL(redirectPara, request.url), { status: 303 });
}
