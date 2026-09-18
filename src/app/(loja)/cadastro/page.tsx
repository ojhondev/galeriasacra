"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cadastrar, type AuthState } from "@/lib/auth-actions";

const ESTADO_INICIAL: AuthState = {};

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroForm />
    </Suspense>
  );
}

function CadastroForm() {
  const searchParams = useSearchParams();
  const redirectPara = searchParams.get("redirect") ?? "/";
  const [estado, formAction, pendente] = useActionState(cadastrar, ESTADO_INICIAL);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px] max-w-md">
      <h1 className="text-[32px] mb-[32px]">Criar Conta</h1>

      <form action={formAction} className="flex flex-col gap-[17px]">
        <input type="hidden" name="redirect" value={redirectPara} />

        <label className="flex flex-col gap-1">
          <span className="text-[14px] text-black/60">Nome</span>
          <input
            type="text"
            name="nome"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] text-black/60">E-mail</span>
          <input
            type="email"
            name="email"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] text-black/60">WhatsApp</span>
          <input
            type="tel"
            name="whatsapp"
            placeholder="(14) 99999-9999"
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] text-black/60">Senha</span>
          <input
            type="password"
            name="senha"
            required
            minLength={6}
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        {estado.erro && <p className="text-[16px] text-[var(--color-brand)]">{estado.erro}</p>}

        <button
          type="submit"
          disabled={pendente}
          className="bg-black text-white px-8 py-4 text-[16px] rounded-[6px] mt-4 disabled:opacity-50"
        >
          {pendente ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="text-[16px] mt-[29px]">
        Já tem conta?{" "}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
