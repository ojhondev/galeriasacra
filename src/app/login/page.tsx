"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { entrar, type AuthState } from "@/lib/auth-actions";

const ESTADO_INICIAL: AuthState = {};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPara = searchParams.get("redirect") ?? "/";
  const [estado, formAction, pendente] = useActionState(entrar, ESTADO_INICIAL);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px] max-w-md">
      <h1 className="text-[32px] mb-[32px]">Entrar</h1>

      <form action={formAction} className="flex flex-col gap-[17px]">
        <input type="hidden" name="redirect" value={redirectPara} />

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
          <span className="text-[14px] text-black/60">Senha</span>
          <input
            type="password"
            name="senha"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        {estado.erro && <p className="text-[16px] text-[var(--color-brand)]">{estado.erro}</p>}

        <button
          type="submit"
          disabled={pendente}
          className="bg-black text-white px-8 py-4 text-[16px] mt-4 disabled:opacity-50"
        >
          {pendente ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-[16px] mt-[29px]">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
