"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconClose, IconChevronRight, IconCheck, IconTruck, IconBox } from "@/components/icons";
import type { Produto } from "@/lib/products";

function QuickViewConteudo({
  produto,
  mostrarImagem = true,
}: {
  produto: Produto;
  mostrarImagem?: boolean;
}) {
  const emEstoque = produto.estoque > 0;
  const dias = produto.prazoEntregaDias;
  const diasLabel = dias === 1 ? "1 dia útil" : `${dias} dias úteis`;

  const etapas = [
    {
      label: "Hoje",
      descricao: "Seu pedido é separado e enviado para a transportadora.",
      icone: <IconCheck className="w-4 h-4" />,
      concluida: true,
    },
    {
      label: "Amanhã",
      descricao: "Em trânsito com a transportadora.",
      icone: <IconTruck className="w-4 h-4" />,
      concluida: false,
    },
    {
      label: `Até ${diasLabel}`,
      descricao: "Seu pedido chega no seu endereço.",
      icone: <IconBox className="w-4 h-4" />,
      concluida: false,
    },
  ];

  return (
    <div>
      <div
        className={`rounded-none py-3 text-center text-[13px] tracking-artu uppercase font-semibold text-white ${
          emEstoque ? "bg-[var(--color-brand)]" : "bg-black/60"
        }`}
      >
        {emEstoque ? "Produto em estoque" : "Produto esgotado"}
      </div>

      <div className="px-4 md:px-8 py-[24px]">
        {mostrarImagem && (
          <ArtPlate
            orientacao={produto.orientacao}
            imagemUrl={produto.imagens?.["sem-moldura"]}
            className="mb-[24px] max-w-[220px] mx-auto rounded-none"
          />
        )}

        <p className="text-[13px] tracking-artu text-black/60 mb-1">
          {produto.categoria.toUpperCase()}
        </p>
        <h2 className="text-[22px] leading-tight mb-[17px]">{produto.nome}</h2>

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] mb-[17px]"
          style={{ background: "#EAF7EE", color: "#1F7A3A" }}
        >
          <IconTruck className="w-4 h-4" /> Entrega rápida e segura
        </div>

        <h3 className="text-[20px] leading-tight mb-2">
          Seu pedido chega em até {diasLabel}!
        </h3>
        <p className="text-[14px] text-black/60 mb-[24px]">
          Conte com um processo logístico eficiente e acompanhe tudo em tempo real.
        </p>

        <div className="flex flex-col mb-[24px]">
          {etapas.map((etapa, i) => (
            <div key={etapa.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                    etapa.concluida ? "text-white" : "bg-black/5 text-black/40"
                  }`}
                  style={etapa.concluida ? { background: "#1F7A3A" } : undefined}
                >
                  {etapa.icone}
                </div>
                {i < etapas.length - 1 && <div className="w-px flex-1 bg-black/15 my-1" />}
              </div>
              <div className={i < etapas.length - 1 ? "pb-[17px]" : ""}>
                <p className="text-[15px] font-semibold">{etapa.label}</p>
                <p className="text-[13px] text-black/60">{etapa.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/quadros/${produto.slug}`}
          className="block w-full text-center text-white px-6 py-4 text-[16px] rounded-[6px] mb-3"
          style={{ background: emEstoque ? "#2E9E4F" : "#00000040" }}
        >
          COMPRAR AGORA
        </Link>

        <Link
          href={`/quadros/${produto.slug}`}
          className="text-[14px] underline flex items-center gap-1 justify-center"
        >
          Ver página completa <IconChevronRight />
        </Link>
      </div>
    </div>
  );
}

export function QuickViewDrawer({
  produto,
  onClose,
}: {
  produto: Produto | null;
  onClose: () => void;
}) {
  const [produtoExibido, setProdutoExibido] = useState<Produto | null>(null);

  useEffect(() => {
    if (produto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mantém o último produto exibido durante a animação de saída (fade/slide), antes de desmontar
      setProdutoExibido(produto);
      return;
    }
    const timer = setTimeout(() => setProdutoExibido(null), 300);
    return () => clearTimeout(timer);
  }, [produto]);

  useEffect(() => {
    if (!produto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [produto]);

  const aberto = produto !== null;

  return (
    <div
      className={`fixed inset-0 z-50 ${aberto ? "" : "pointer-events-none"}`}
      aria-hidden={!aberto}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`hidden md:block absolute right-0 top-0 h-full w-[440px] bg-white overflow-y-auto transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 py-[17px] border-b border-black sticky top-0 bg-white z-10">
          <p className="text-[14px] font-medium">Visualização Rápida</p>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <IconClose />
          </button>
        </div>

        {produtoExibido && <QuickViewConteudo key={produtoExibido.id} produto={produtoExibido} />}
      </div>

      <div
        className={`md:hidden absolute inset-x-0 bottom-0 max-h-[85vh] bg-white overflow-y-auto rounded-t-[16px] transition-transform duration-300 ${
          aberto ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-[17px] border-b border-black sticky top-0 bg-white z-10 rounded-t-[16px]">
          <p className="text-[14px] font-medium">Visualização Rápida</p>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <IconClose />
          </button>
        </div>

        {produtoExibido && (
          <QuickViewConteudo key={produtoExibido.id} produto={produtoExibido} mostrarImagem={false} />
        )}
      </div>
    </div>
  );
}
