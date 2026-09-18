"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconClose } from "@/components/icons";
import { inscreverLeadAction } from "@/lib/leads-actions";

const STORAGE_KEY = "galeriasacra:cadastro-popup-fechado";
const ATRASO_MS = 2500;

export function CadastroPopup() {
  const [aberto, setAberto] = useState(false);
  const [inscrito, setInscrito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // ignora storage indisponível
    }
    const timer = setTimeout(() => setAberto(true), ATRASO_MS);
    return () => clearTimeout(timer);
  }, []);

  function fechar() {
    setAberto(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignora storage indisponível
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={fechar}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-[6px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[220px]">
          <Image
            src="/popup-cadastro-header.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <Image
              src="/logo-galeriasacra-preta.png"
              alt="Galeria Sacra"
              width={765}
              height={406}
              className="h-[36px] w-auto brightness-0 invert"
            />
          </div>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white"
          >
            <IconClose />
          </button>
        </div>

        <div className="px-8 pt-8 pb-8">
          {inscrito ? (
            <div className="text-center py-4">
              <p className="text-[24px] mb-2">Cadastro recebido</p>
              <p className="text-[16px] text-black/60">
                Em breve você receberá nossas ofertas exclusivas por e-mail.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[32px] leading-[1.15] text-center mb-6">
                Cadastre-se e garanta descontos exclusivos
              </p>

              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = emailRef.current?.value ?? "";
                  const whatsapp = whatsappRef.current?.value ?? "";
                  setEnviando(true);
                  await inscreverLeadAction(email, whatsapp);
                  setEnviando(false);
                  setInscrito(true);
                }}
              >
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="E-mail"
                  className="bg-black/5 px-4 py-4 text-[16px] outline-none rounded-[6px] placeholder:text-black/50"
                />
                <input
                  ref={whatsappRef}
                  type="tel"
                  required
                  placeholder="WhatsApp"
                  className="bg-black/5 px-4 py-4 text-[16px] outline-none rounded-[6px] placeholder:text-black/50"
                />
                <button
                  type="submit"
                  disabled={enviando}
                  className="text-white px-6 py-4 text-[14px] tracking-artu rounded-[6px] mt-2 disabled:opacity-60"
                  style={{ background: "var(--color-brand)" }}
                >
                  {enviando ? "Enviando..." : "QUERO ME CADASTRAR"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
