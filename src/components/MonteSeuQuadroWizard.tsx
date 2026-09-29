"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArtPlate } from "@/components/ArtPlate";
import { ARPreview } from "@/components/ARPreview";
import { IconClose, IconChevronRight } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { useArrastarScroll } from "@/lib/useArrastarScroll";
import { registrarProdutoVisto } from "@/lib/produto-visto";
import { TESTAR_AMBIENTE_HABILITADO } from "@/lib/feature-flags";
import {
  MATERIAIS,
  MATERIAL_PADRAO,
  MOLDURAS,
  MOLDURA_PADRAO,
  TAMANHOS,
  calcularPreco,
  formatarPreco,
  type MolduraId,
  type TamanhoId,
} from "@/lib/pricing";
import type { Produto, Orientacao } from "@/lib/products";
import type { Colecao } from "@/lib/colecoes";

const ETAPAS = ["imagem", "tamanho", "moldura", "revisao"] as const;
type Etapa = (typeof ETAPAS)[number];

function aspectRatioDoTamanho(tamanhoId: TamanhoId | null, orientacao: Orientacao): number {
  if (orientacao === "quadrado") return 1;
  const [a, b] = (tamanhoId ?? "40x60").split("x").map(Number);
  const [largura, altura] = orientacao === "paisagem" ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
  return largura / altura;
}

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

const ORIENTACOES: { id: Orientacao; label: string }[] = [
  { id: "retrato", label: "Retrato" },
  { id: "paisagem", label: "Paisagem" },
  { id: "quadrado", label: "Quadrado" },
];

function ChipFiltro({
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
      className={`shrink-0 px-4 py-2 text-[13px] tracking-artu border rounded-full transition-colors ${
        ativo ? "border-black bg-black text-white" : "border-black/20 text-black/60 hover:border-black"
      }`}
    >
      {children}
    </button>
  );
}

export function MonteSeuQuadroWizard({ produtos, colecoes }: { produtos: Produto[]; colecoes: Colecao[] }) {
  const { adicionar, abrirDrawer } = useCart();
  const {
    ref: carrosselRef,
    arrastando: carrosselArrastando,
    handlers: carrosselHandlers,
    bloquearCliqueSeArrastou,
    rolar,
  } = useArrastarScroll<HTMLDivElement>();

  const [etapaIndex, setEtapaIndex] = useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>(undefined);
  const [imagemPropria, setImagemPropria] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroOrientacao, setFiltroOrientacao] = useState<Orientacao | null>(null);
  const [tamanho, setTamanho] = useState<TamanhoId | null>(null);
  const [moldura, setMoldura] = useState<MolduraId | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const categoriasDisponiveis = colecoes
    .filter((c) => produtos.some((p) => p.categoria === c.nome))
    .map((c) => c.nome);
  const produtosFiltrados = produtos.filter(
    (p) =>
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!filtroOrientacao || p.orientacao === filtroOrientacao),
  );

  const etapa: Etapa = ETAPAS[etapaIndex];
  const precoBase = produtoSelecionado?.precoBase ?? 349;
  const aspectRatio = aspectRatioDoTamanho(tamanho, produtoSelecionado?.orientacao ?? "retrato");
  const preco =
    tamanho && moldura ? calcularPreco(precoBase, tamanho, moldura, MATERIAL_PADRAO) : null;
  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const nomeItem = imagemPropria
    ? "Quadro personalizado (imagem própria)"
    : produtoSelecionado?.nome ?? "Monte Seu Quadro";
  const tamanhoLabelAtual = TAMANHOS.find((t) => t.id === tamanho)?.label ?? "";

  const podeAvancar = useMemo(() => {
    switch (etapa) {
      case "imagem":
        return produtoSelecionado !== undefined || imagemPropria !== null;
      case "tamanho":
        return tamanho !== null;
      case "moldura":
        return moldura !== null;
      default:
        return true;
    }
  }, [etapa, produtoSelecionado, imagemPropria, tamanho, moldura]);

  function avancar() {
    if (!podeAvancar) return;
    setEtapaIndex((i) => Math.min(i + 1, ETAPAS.length - 1));
  }
  function voltar() {
    setEtapaIndex((i) => Math.max(i - 1, 0));
  }

  function escolherProduto(p: Produto) {
    setProdutoSelecionado(p);
    setImagemPropria(null);
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setImagemPropria(URL.createObjectURL(arquivo));
    setNomeArquivo(arquivo.name);
    setProdutoSelecionado(undefined);
  }

  function handleComprarAgora() {
    adicionar({
      nome: nomeItem,
      hue: produtoSelecionado?.hue ?? 200,
      imagemUrl: imagemPropria ? null : (produtoSelecionado?.imagens?.[moldura!] ?? null),
      tamanho: tamanho!,
      tamanhoLabel: tamanhoLabelAtual,
      moldura: moldura!,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material: MATERIAL_PADRAO,
      materialLabel: MATERIAIS[0].label,
      personalizado: true,
      precoUnitario: preco!,
      quantidade,
    });
    if (produtoSelecionado) {
      registrarProdutoVisto({ nome: produtoSelecionado.nome, slug: produtoSelecionado.slug });
    }
    abrirDrawer();
  }

  const progresso = Math.round(((etapaIndex + 1) / ETAPAS.length) * 100);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex">
      <div className="hidden md:block relative w-1/2 h-full shrink-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/monte-seu-quadro.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
          <p className="text-[13px] tracking-artu uppercase mb-3">Monte Seu Quadro</p>
          <h2 className="text-[clamp(24px,3vw,34px)] leading-tight max-w-sm">
            Configure um projeto sob medida para o seu espaço sagrado
          </h2>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
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
          <div
            key={etapaIndex}
            className={`animate-step-in w-full ${etapa === "imagem" ? "max-w-4xl" : etapa === "revisao" ? "max-w-[480px]" : "max-w-[560px]"}`}
          >
            {etapa === "imagem" && (
              <div>
                <p className="text-[22px] mb-[24px]">Escolha uma imagem do catálogo</p>

                {categoriasDisponiveis.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-3 -mx-1 px-1">
                    <ChipFiltro ativo={filtroCategoria === null} onClick={() => setFiltroCategoria(null)}>
                      Todas categorias
                    </ChipFiltro>
                    {categoriasDisponiveis.map((nome) => (
                      <ChipFiltro
                        key={nome}
                        ativo={filtroCategoria === nome}
                        onClick={() => setFiltroCategoria(filtroCategoria === nome ? null : nome)}
                      >
                        {nome}
                      </ChipFiltro>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-[24px] -mx-1 px-1">
                  <ChipFiltro ativo={filtroOrientacao === null} onClick={() => setFiltroOrientacao(null)}>
                    Todos formatos
                  </ChipFiltro>
                  {ORIENTACOES.map((o) => (
                    <ChipFiltro
                      key={o.id}
                      ativo={filtroOrientacao === o.id}
                      onClick={() => setFiltroOrientacao(filtroOrientacao === o.id ? null : o.id)}
                    >
                      {o.label}
                    </ChipFiltro>
                  ))}
                </div>

                {produtosFiltrados.length > 0 ? (
                  <div className="relative mb-[24px]">
                    <div
                      ref={carrosselRef}
                      {...carrosselHandlers}
                      className={`flex gap-4 overflow-x-auto scrollbar-hide pb-2 select-none ${
                        carrosselArrastando ? "cursor-grabbing" : "cursor-grab scroll-smooth snap-x snap-mandatory"
                      }`}
                    >
                      {produtosFiltrados.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClickCapture={bloquearCliqueSeArrastou}
                          onClick={() => escolherProduto(p)}
                          aria-label={p.nome}
                          draggable={false}
                          className="shrink-0 w-[220px] md:w-[260px] snap-start"
                          style={{
                            outline:
                              produtoSelecionado?.id === p.id && !imagemPropria ? "2px solid var(--color-brand)" : "none",
                            outlineOffset: "2px",
                          }}
                        >
                          <ArtPlate orientacao={p.orientacao} imagemUrl={p.imagens?.[MOLDURA_PADRAO]} />
                          <p className="text-[14px] mt-2 text-left">{p.nome}</p>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => rolar(300)}
                      aria-label="Ver próximas imagens"
                      className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center"
                    >
                      <IconChevronRight />
                    </button>
                  </div>
                ) : (
                  <p className="text-[15px] text-black/50 text-center mb-[24px]">
                    Nenhuma imagem encontrada para esse filtro.
                  </p>
                )}

                <div className="text-center">
                  <label className="text-[16px] tracking-artu underline cursor-pointer">
                    Ou envie sua própria imagem
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                  {nomeArquivo && <p className="text-[14px] mt-2 text-black/60">{nomeArquivo}</p>}
                </div>
              </div>
            )}

            {etapa === "tamanho" && (
              <div>
                <p className="text-[22px] mb-[24px]">Qual tamanho você prefere?</p>
                <div className="grid grid-cols-2 gap-3">
                  {TAMANHOS.map((t) => (
                    <ChipButton key={t.id} ativo={tamanho === t.id} onClick={() => setTamanho(t.id)}>
                      {t.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
            )}

            {etapa === "moldura" && (
              <div>
                <p className="text-[22px] mb-[24px]">Escolha sua moldura</p>
                <div className="grid grid-cols-2 gap-3">
                  {MOLDURAS.map((m) => (
                    <ChipButton key={m.id} ativo={moldura === m.id} onClick={() => setMoldura(m.id)}>
                      <span className="flex items-center gap-3">
                        {m.cor && (
                          <span
                            className="w-5 h-5 inline-block shrink-0 rounded-full"
                            style={{ background: m.cor }}
                            aria-hidden="true"
                          />
                        )}
                        {m.label.replace(/^Moldura /, "")}
                      </span>
                    </ChipButton>
                  ))}
                </div>
              </div>
            )}

            {etapa === "revisao" && (
              <div>
                <div className="bg-[#f2f2ef] p-[8%] mb-[24px] max-w-[220px] mx-auto lg:max-w-[280px] lg:mx-0">
                  {imagemPropria ? (
                    <div style={molduraAtual?.cor ? { background: molduraAtual.cor, padding: "3.2%" } : undefined}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagemPropria}
                        alt={nomeArquivo ?? "Imagem enviada pelo cliente"}
                        className="w-full h-auto block"
                      />
                    </div>
                  ) : (
                    <ArtPlate
                      orientacao={produtoSelecionado?.orientacao ?? "retrato"}
                      molduraColor={molduraAtual?.cor ?? null}
                      imagemUrl={moldura ? produtoSelecionado?.imagens?.[moldura] : undefined}
                    />
                  )}
                </div>

                <p className="text-[13px] tracking-artu uppercase text-[var(--color-brand)] mb-3">Quase lá</p>
                <h1 className="text-[24px] mb-[11px]">{nomeItem}</h1>

                <p className="text-[28px] leading-tight mb-2">
                  {preco !== null ? formatarPreco(preco) : "—"}
                </p>

                <div
                  className="inline-flex items-center gap-2 rounded-[6px] px-3 py-2 mb-[17px]"
                  style={{ background: "var(--color-brand)" }}
                >
                  <span className="text-[10px] tracking-artu uppercase font-bold bg-white text-[var(--color-brand)] px-2 py-0.5 rounded-[4px] shrink-0">
                    Parcelamento
                  </span>
                  <span className="text-[15px] font-bold text-white">
                    em até 12x de {formatarPreco((preco ?? 0) / 12)} sem juros
                  </span>
                </div>

                <p className="text-[14px] text-black/50 mb-[17px]">Frete calculado no carrinho.</p>

                <ul className="text-[16px] text-black/70 mb-[17px] flex flex-col gap-1">
                  <li>Tamanho: {tamanhoLabelAtual}</li>
                  <li>Material: {MATERIAIS[0].label}</li>
                  <li>Moldura: {MOLDURAS.find((m) => m.id === moldura)?.label}</li>
                </ul>

                {TESTAR_AMBIENTE_HABILITADO && (
                  <button
                    type="button"
                    onClick={() => setTestandoAmbiente(true)}
                    className="text-[16px] tracking-artu underline"
                  >
                    Testar no Meu Ambiente
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {etapaIndex < ETAPAS.length - 1 ? (
          <div className="flex items-center justify-between px-4 md:px-8 py-[17px] border-t border-black/10 shrink-0">
            {etapaIndex > 0 ? (
              <button type="button" onClick={voltar} className="text-[14px] text-black/60 hover:text-black">
                Voltar
              </button>
            ) : (
              <span />
            )}
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
        ) : (
          <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-[17px] border-t border-black/10 shrink-0">
            <button type="button" onClick={voltar} className="text-[14px] text-black/60 hover:text-black shrink-0">
              Voltar
            </button>
            <div className="flex items-stretch gap-3">
              <div className="flex items-center border border-black shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-[18px]"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="px-4 text-[16px] min-w-[32px] text-center">{quantidade}</span>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => q + 1)}
                  className="px-4 py-2 text-[18px]"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleComprarAgora}
                className="inline-flex items-center justify-center text-white px-6 py-3 text-[15px] rounded-[6px]"
                style={{ background: "var(--color-brand)" }}
              >
                Comprar Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {testandoAmbiente && (
        <ARPreview
          aspectRatio={aspectRatio}
          hue={produtoSelecionado?.hue ?? 200}
          molduraColor={molduraAtual?.cor ?? null}
          imagemUrl={imagemPropria}
          onClose={() => setTestandoAmbiente(false)}
        />
      )}
    </div>
  );
}
