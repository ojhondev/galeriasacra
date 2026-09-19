"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";

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
  const temErro = searchParams.get("erro") === "1";

  return (
    <AuthShell>
      <h1 className="text-[32px] mb-[32px]">Entrar</h1>

      <form action="/api/auth/login" method="POST" className="flex flex-col gap-[17px]">
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

        {temErro && <p className="text-[16px] text-[var(--color-brand)]">E-mail ou senha incorretos.</p>}

        <button
          type="submit"
          className="bg-black text-white px-8 py-4 text-[16px] rounded-[6px] mt-4"
        >
          Entrar
        </button>
      </form>

      <p className="text-[16px] mt-[29px]">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="underline">
          Cadastre-se
        </Link>
      </p>
    </AuthShell>
  );
}
