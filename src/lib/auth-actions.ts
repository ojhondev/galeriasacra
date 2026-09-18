"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { hashSenha, verificarSenha } from "@/lib/senha";
import { criarSessao, destruirSessao } from "@/lib/session";

export type AuthState = { erro?: string };

export async function cadastrar(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const redirectPara = String(formData.get("redirect") ?? "/");

  if (!nome || !email || senha.length < 6) {
    return { erro: "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres." };
  }

  const existente = await db.query.usuarios.findFirst({ where: eq(usuarios.email, email) });
  if (existente) {
    return { erro: "Já existe uma conta com esse e-mail." };
  }

  const senhaHash = await hashSenha(senha);
  const [usuario] = await db
    .insert(usuarios)
    .values({ nome, email, whatsapp: whatsapp || null, senhaHash, role: "cliente" })
    .returning();

  await criarSessao({ userId: usuario.id, email: usuario.email, nome: usuario.nome, role: usuario.role });
  redirect(redirectPara || "/");
}

export async function entrar(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const redirectPara = String(formData.get("redirect") ?? "/");

  const usuario = await db.query.usuarios.findFirst({ where: eq(usuarios.email, email) });
  if (!usuario || !(await verificarSenha(senha, usuario.senhaHash))) {
    return { erro: "E-mail ou senha incorretos." };
  }

  await criarSessao({ userId: usuario.id, email: usuario.email, nome: usuario.nome, role: usuario.role });
  redirect(redirectPara || "/");
}

export async function sair() {
  await destruirSessao();
  redirect("/");
}
