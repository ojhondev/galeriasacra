"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconClose, IconChevronRight, IconPlus, IconCheck } from "@/components/icons";
import { criarSolicitacaoRestauro } from "@/lib/restauro-actions";
import { TIPOS_OBRA, TIPOS_DANO, NIVEIS_URGENCIA } from "@/lib/restauro-shared";

const WHATSAPP_NUMERO = "5514998570045";

type Respostas = {
  tipoObra: string;
  largura: string;
  altura: string;
  tiposDano: string[];
  descricao: string;
  urgencia: string;
  nome: string;
  email: string;
  whatsapp: string;
};

const RESPOSTAS_INICIAIS: Respostas = {
  tipoObra: "",
  largura: "",
  altura: "",
  tiposDano: [],
  descricao: "",
  urgencia: "",
  nome: "",
  email: "",
  whatsapp: "",
};

const TOTAL_ETAPAS = 11;

function ChipButton({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-5 py-4 rounded-[6px] border text-[16px] transition-colors ${
        ativo ? "text-white border-transparent" : "border-black/15 hover:border-black/40"
      }`}
      style={ativo ? { background: "var(--color-brand)" } : undefined}
    >
      {children}
    </button>
  );
}

function CampoTexto({
  label,
  valor,
  onChange,
  onEnter,
  tipo = "text",
  placeholder,
  autoFocus = true,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  tipo?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  }

  return (
    <div>
      <p className="text-[22px] mb-[24px]">{label}</p>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border-b-2 border-black py-3 text-[24px] outline-none bg-transparent"
      />
    </div>
  );
}

export function RestauroWizard() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>(RESPOSTAS_INICIAIS);
  const [fotos, setFotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function adicionarFotos(lista: FileList | null) {
    if (!lista) return;
    const novos = Array.from(lista);
    setFotos((prev) => [...prev, ...novos]);
    setPreviews((prev) => [...prev, ...novos.map((f) => URL.createObjectURL(f))]);
  }

  function removerFoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function set<K extends keyof Respostas>(chave: K, valor: Respostas[K]) {
    setRespostas((prev) => ({ ...prev, [chave]: valor }));
  }

  function alternarDano(dano: string) {
    setRespostas((prev) => ({
      ...prev,
      tiposDano: prev.tiposDano.includes(dano)
        ? prev.tiposDano.filter((d) => d !== dano)
        : [...prev.tiposDano, dano],
    }));
  }

  const emailValido = useMemo(() => /\S+@\S+\.\S+/.test(respostas.email), [respostas.email]);

  const podeAvancar = useMemo(() => {
    switch (etapa) {
      case 1:
        return fotos.length > 0;
      case 2:
        return respostas.tipoObra !== "";
      case 3:
        return true;
      case 4:
        return respostas.tiposDano.length > 0;
      case 5:
        return true;
      case 6:
        return respostas.urgencia !== "";
      case 7:
        return respostas.nome.trim() !== "";
      case 8:
        return emailValido;
      case 9:
        return respostas.whatsapp.trim().length >= 8;
      default:
        return true;
    }
  }, [etapa, fotos, respostas, emailValido]);

  function avancar() {
    if (!podeAvancar) return;
    setEtapa((e) => Math.min(e + 1, TOTAL_ETAPAS - 1));
  }

  function voltar() {
    setEtapa((e) => Math.max(e - 1, 0));
  }

  async function enviarSolicitacao() {
    setEnviando(true);
    const numero = await criarSolicitacaoRestauro({
      nome: respostas.nome.trim(),
      email: respostas.email.trim(),
      whatsapp: respostas.whatsapp.trim(),
      tipoObra: respostas.tipoObra,
      largura: respostas.largura ? Math.round(Number(respostas.largura)) : null,
      altura: respostas.altura ? Math.round(Number(respostas.altura)) : null,
      tiposDano: respostas.tiposDano,
      descricao: respostas.descricao.trim(),
      urgencia: respostas.urgencia,
      quantidadeFotos: fotos.length,
    });

    const dimensoes =
      respostas.largura && respostas.altura ? `${respostas.largura}x${respostas.altura}cm` : "não informadas";

    const mensagem =
      `Olá! Meu nome é ${respostas.nome} e gostaria de um orçamento para restauro de quadro (Nº ${numero}).\n\n` +
      `Tipo de obra: ${respostas.tipoObra}\n` +
      `Dimensões aproximadas: ${dimensoes}\n` +
      `Problemas identificados: ${respostas.tiposDano.join(", ")}\n` +
      (respostas.descricao ? `Descrição: ${respostas.descricao}\n` : "") +
      `Urgência: ${respostas.urgencia}\n` +
      `E-mail: ${respostas.email}\n\n` +
      `Vou enviar ${fotos.length} foto(s) da obra aqui na conversa.`;

    setConcluido(true);
    window.location.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  }

  const progresso = Math.round((etapa / (TOTAL_ETAPAS - 1)) * 100);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      <div className="h-1 bg-black/10 shrink-0">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progresso}%`, background: "var(--color-brand)" }}
        />
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-[17px] shrink-0">
        <Image
          src="/logo-galeriasacra-vinho.png"
          alt="Galeria Sacra"
          width={765}
          height={406}
          className="h-[32px] w-auto"
        />
        <Link href="/" aria-label="Fechar" className="text-black/60 hover:text-black">
          <IconClose />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 md:px-8 py-[24px]">
        <div key={etapa} className="animate-step-in w-full max-w-[560px]">
          {etapa === 0 && (
            <div>
              <p className="text-[13px] tracking-artu uppercase text-[var(--color-brand)] mb-3">
                Restaure Seu Quadro
              </p>
              <h1 className="text-[32px] md:text-[40px] leading-tight mb-[17px]">
                Vamos devolver a vida à sua obra
              </h1>
              <p className="text-[16px] text-black/60 mb-[32px]">
                Responda algumas perguntas rápidas sobre a peça e envie fotos do estado atual.
                Nossa equipe prepara um orçamento sob medida para o restauro.
              </p>
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="inline-flex items-center gap-2 text-white px-8 py-4 text-[16px] rounded-[6px]"
                style={{ background: "var(--color-brand)" }}
              >
                Começar <IconChevronRight />
              </button>
            </div>
          )}

          {etapa === 1 && (
            <div>
              <p className="text-[22px] mb-[24px]">Envie fotos da obra que precisa de restauro.</p>
              <div className="flex flex-wrap gap-3 mb-[17px]">
                {previews.map((url, i) => (
                  <div key={url} className="relative w-[88px] h-[88px] rounded-[6px] overflow-hidden">
                    <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => removerFoto(i)}
                      aria-label="Remover foto"
                      className="absolute top-1 right-1 w-5 h-5 bg-white flex items-center justify-center rounded-full"
                    >
                      <IconClose className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => inputFileRef.current?.click()}
                  className="w-[88px] h-[88px] rounded-[6px] border-2 border-dashed border-black/20 flex items-center justify-center text-black/40 hover:border-black/40"
                  aria-label="Adicionar fotos"
                >
                  <IconPlus />
                </button>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => adicionarFotos(e.target.files)}
                />
              </div>
              <p className="text-[13px] text-black/50">
                Envie ao menos 1 foto. Você poderá enviar mais fotos depois, direto pelo WhatsApp.
              </p>
            </div>
          )}

          {etapa === 2 && (
            <div>
              <p className="text-[22px] mb-[24px]">Qual é o tipo da obra?</p>
              <div className="grid grid-cols-2 gap-3">
                {TIPOS_OBRA.map((tipo) => (
                  <ChipButton key={tipo} ativo={respostas.tipoObra === tipo} onClick={() => set("tipoObra", tipo)}>
                    {tipo}
                  </ChipButton>
                ))}
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div>
              <p className="text-[22px] mb-[24px]">Quais as dimensões aproximadas? (opcional)</p>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col gap-1">
                  <span className="text-[13px] text-black/60">Largura (cm)</span>
                  <input
                    type="number"
                    min={0}
                    value={respostas.largura}
                    onChange={(e) => set("largura", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && avancar()}
                    className="border-b-2 border-black py-3 text-[24px] outline-none bg-transparent"
                  />
                </label>
                <label className="flex-1 flex flex-col gap-1">
                  <span className="text-[13px] text-black/60">Altura (cm)</span>
                  <input
                    type="number"
                    min={0}
                    value={respostas.altura}
                    onChange={(e) => set("altura", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && avancar()}
                    className="border-b-2 border-black py-3 text-[24px] outline-none bg-transparent"
                  />
                </label>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div>
              <p className="text-[22px] mb-[24px]">Quais problemas a obra apresenta?</p>
              <div className="grid grid-cols-2 gap-3">
                {TIPOS_DANO.map((dano) => (
                  <ChipButton key={dano} ativo={respostas.tiposDano.includes(dano)} onClick={() => alternarDano(dano)}>
                    {dano}
                  </ChipButton>
                ))}
              </div>
            </div>
          )}

          {etapa === 5 && (
            <div>
              <p className="text-[22px] mb-[24px]">Quer descrever mais detalhes? (opcional)</p>
              <textarea
                value={respostas.descricao}
                onChange={(e) => set("descricao", e.target.value)}
                rows={4}
                autoFocus
                placeholder="Conte um pouco mais sobre a história ou o estado da obra..."
                className="w-full border-b-2 border-black py-3 text-[18px] outline-none bg-transparent resize-none"
              />
            </div>
          )}

          {etapa === 6 && (
            <div>
              <p className="text-[22px] mb-[24px]">Qual a urgência do restauro?</p>
              <div className="flex flex-col gap-3">
                {NIVEIS_URGENCIA.map((nivel) => (
                  <ChipButton key={nivel} ativo={respostas.urgencia === nivel} onClick={() => set("urgencia", nivel)}>
                    {nivel}
                  </ChipButton>
                ))}
              </div>
            </div>
          )}

          {etapa === 7 && (
            <CampoTexto label="Qual o seu nome?" valor={respostas.nome} onChange={(v) => set("nome", v)} onEnter={avancar} placeholder="Seu nome completo" />
          )}

          {etapa === 8 && (
            <CampoTexto
              label="Qual o seu e-mail?"
              valor={respostas.email}
              onChange={(v) => set("email", v)}
              onEnter={avancar}
              tipo="email"
              placeholder="voce@email.com"
            />
          )}

          {etapa === 9 && (
            <CampoTexto
              label="Qual o seu WhatsApp?"
              valor={respostas.whatsapp}
              onChange={(v) => set("whatsapp", v)}
              onEnter={avancar}
              tipo="tel"
              placeholder="(14) 99999-9999"
            />
          )}

          {etapa === 10 && (
            <div>
              <p className="text-[13px] tracking-artu uppercase text-[var(--color-brand)] mb-3">Quase lá</p>
              <h2 className="text-[26px] leading-tight mb-[24px]">Confirme os dados da sua solicitação</h2>

              <div className="flex flex-col gap-3 mb-[32px] text-[15px]">
                <p><span className="text-black/50">Obra:</span> {respostas.tipoObra}</p>
                <p><span className="text-black/50">Fotos:</span> {fotos.length}</p>
                <p><span className="text-black/50">Problemas:</span> {respostas.tiposDano.join(", ")}</p>
                <p><span className="text-black/50">Urgência:</span> {respostas.urgencia}</p>
                <p><span className="text-black/50">Nome:</span> {respostas.nome}</p>
                <p><span className="text-black/50">E-mail:</span> {respostas.email}</p>
                <p><span className="text-black/50">WhatsApp:</span> {respostas.whatsapp}</p>
              </div>

              <button
                type="button"
                onClick={enviarSolicitacao}
                disabled={enviando || concluido}
                className="w-full inline-flex items-center justify-center gap-2 text-white px-8 py-4 text-[16px] rounded-[6px] disabled:opacity-60"
                style={{ background: "var(--color-brand)" }}
              >
                {enviando ? "Enviando..." : concluido ? <><IconCheck className="w-5 h-5" /> Enviado</> : "Solicitar Orçamento"}
              </button>
              <p className="text-[13px] text-black/50 mt-3">
                Você será redirecionado ao WhatsApp para enviar as fotos e finalizar com nossa equipe.
              </p>
            </div>
          )}
        </div>
      </div>

      {etapa > 0 && etapa < TOTAL_ETAPAS - 1 && (
        <div className="flex items-center justify-between px-4 md:px-8 py-[17px] border-t border-black/10 shrink-0">
          <button type="button" onClick={voltar} className="text-[14px] text-black/60 hover:text-black">
            Voltar
          </button>
          <button
            type="button"
            onClick={avancar}
            disabled={!podeAvancar}
            className="inline-flex items-center gap-2 text-white px-6 py-3 text-[15px] rounded-[6px] disabled:opacity-30"
            style={{ background: "var(--color-brand)" }}
          >
            Continuar <IconChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
