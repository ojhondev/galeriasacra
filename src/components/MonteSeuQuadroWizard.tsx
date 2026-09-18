"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
import { ARPreview } from "@/components/ARPreview";
import { FinalizandoCompra } from "@/components/FinalizandoCompra";
import { useCart } from "@/lib/cart";
import { useArrastarScroll } from "@/lib/useArrastarScroll";
import { TESTAR_AMBIENTE_HABILITADO } from "@/lib/feature-flags";
import {
  MATERIAIS,
  MOLDURAS,
  TAMANHOS,
  calcularPreco,
  calcularPrecoComMultiplicador,
  multiplicadorTamanhoPersonalizado,
  formatarPreco,
  type MaterialId,
  type MolduraId,
  type TamanhoId,
} from "@/lib/pricing";
import type { Produto, Orientacao } from "@/lib/products";

const ETAPAS = ["imagem", "tamanho", "material", "moldura", "revisao"] as const;
type Etapa = (typeof ETAPAS)[number];

type TamanhoCustom = { largura: number; altura: number };

function aspectRatioDoTamanho(
  tamanhoId: TamanhoId | null,
  custom: TamanhoCustom | null,
  orientacao: Orientacao,
): number {
  if (custom) return custom.largura / custom.altura;
  if (orientacao === "quadrado") return 1;
  const [a, b] = (tamanhoId ?? "40x60").split("x").map(Number);
  const [largura, altura] = orientacao === "paisagem" ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
  return largura / altura;
}

const ATRASO_AVANCO_MS = 250;

function OpcaoBotao({
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
      className={`border px-6 py-4 text-[20px] text-left transition-colors ${
        ativo ? "border-black bg-black text-white" : "border-black/20 hover:border-black"
      }`}
    >
      {children}
    </button>
  );
}

export function MonteSeuQuadroWizard({ produtos }: { produtos: Produto[] }) {
  const router = useRouter();
  const { adicionar } = useCart();
  const {
    ref: carrosselRef,
    arrastando: carrosselArrastando,
    handlers: carrosselHandlers,
    bloquearCliqueSeArrastou,
  } = useArrastarScroll<HTMLDivElement>();

  const [etapaIndex, setEtapaIndex] = useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>(produtos[0]);
  const [imagemPropria, setImagemPropria] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<TamanhoId | null>(null);
  const [tamanhoCustom, setTamanhoCustom] = useState<TamanhoCustom | null>(null);
  const [larguraInput, setLarguraInput] = useState("");
  const [alturaInput, setAlturaInput] = useState("");
  const [material, setMaterial] = useState<MaterialId | null>(null);
  const [moldura, setMoldura] = useState<MolduraId | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [finalizando, setFinalizando] = useState(false);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const etapa: Etapa = ETAPAS[etapaIndex];
  const precoBase = produtoSelecionado?.precoBase ?? 349;
  const aspectRatio = aspectRatioDoTamanho(tamanho, tamanhoCustom, produtoSelecionado?.orientacao ?? "retrato");
  const temTamanho = tamanho !== null || tamanhoCustom !== null;
  const preco =
    temTamanho && material && moldura
      ? tamanhoCustom
        ? calcularPrecoComMultiplicador(
            precoBase,
            multiplicadorTamanhoPersonalizado(tamanhoCustom.largura, tamanhoCustom.altura),
            moldura,
            material,
          )
        : calcularPreco(precoBase, tamanho!, moldura, material)
      : null;
  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const nomeItem = imagemPropria
    ? "Quadro personalizado (imagem própria)"
    : produtoSelecionado?.nome ?? "Monte Seu Quadro";
  const tamanhoLabelAtual = tamanhoCustom
    ? `${tamanhoCustom.largura} × ${tamanhoCustom.altura} cm (personalizado)`
    : (TAMANHOS.find((t) => t.id === tamanho)?.label ?? "");

  function avancar() {
    setEtapaIndex((i) => Math.min(i + 1, ETAPAS.length - 1));
  }
  function voltar() {
    setEtapaIndex((i) => Math.max(i - 1, 0));
  }

  function escolherProduto(p: Produto) {
    setProdutoSelecionado(p);
    setImagemPropria(null);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setImagemPropria(URL.createObjectURL(arquivo));
    setNomeArquivo(arquivo.name);
    setProdutoSelecionado(undefined);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }

  function escolherTamanho(id: TamanhoId) {
    setTamanho(id);
    setTamanhoCustom(null);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }

  function confirmarTamanhoPersonalizado() {
    const largura = Number(larguraInput);
    const altura = Number(alturaInput);
    if (!largura || !altura || largura <= 0 || altura <= 0) return;
    setTamanhoCustom({ largura, altura });
    setTamanho(null);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }

  function escolherMaterial(id: MaterialId) {
    setMaterial(id);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }
  function escolherMoldura(id: MolduraId) {
    setMoldura(id);
    setTimeout(avancar, ATRASO_AVANCO_MS);
  }

  function handleConcluirCompra() {
    adicionar({
      nome: nomeItem,
      hue: produtoSelecionado?.hue ?? 200,
      tamanho: tamanhoCustom ? `${tamanhoCustom.largura}x${tamanhoCustom.altura}` : tamanho!,
      tamanhoLabel: tamanhoLabelAtual,
      moldura: moldura!,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material: material!,
      materialLabel: MATERIAIS.find((m) => m.id === material)!.label,
      personalizado: true,
      precoUnitario: preco!,
      quantidade,
    });
    router.push("/carrinho");
  }

  if (finalizando) {
    return <FinalizandoCompra onConcluir={handleConcluirCompra} />;
  }

  return (
    <div className="flex flex-col">
      <div className="w-full h-1 bg-black/10">
        <div
          className="h-1 bg-[var(--color-brand)] transition-all duration-300"
          style={{ width: `${((etapaIndex + 1) / ETAPAS.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-[17px]">
        {etapaIndex > 0 ? (
          <button type="button" onClick={voltar} className="text-[16px] tracking-artu underline">
            ← Voltar
          </button>
        ) : (
          <span />
        )}
        <p className="text-[14px] tracking-artu text-black/50">
          {etapaIndex + 1} de {ETAPAS.length}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-[32px] min-h-[60vh]">
        <div className={`w-full ${etapa === "imagem" ? "max-w-4xl" : etapa === "revisao" ? "max-w-4xl" : "max-w-2xl"}`}>
          {etapa === "imagem" && (
            <div>
              <h1 className="text-[clamp(22px,5vw,36px)] mb-[32px] text-center">
                Escolha uma imagem do catálogo
              </h1>

              <div
                ref={carrosselRef}
                {...carrosselHandlers}
                className={`flex gap-4 overflow-x-auto pb-2 mb-[24px] select-none ${
                  carrosselArrastando ? "cursor-grabbing" : "cursor-grab scroll-smooth snap-x snap-mandatory"
                }`}
              >
                {produtos.map((p) => (
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
                        produtoSelecionado?.id === p.id && !imagemPropria ? "2px solid black" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    <ArtPlate hue={p.hue} orientacao={p.orientacao} />
                    <p className="text-[14px] mt-2 text-left">{p.nome}</p>
                  </button>
                ))}
              </div>

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
              <h1 className="text-[clamp(22px,5vw,36px)] mb-[32px] text-center">
                Qual tamanho você prefere?
              </h1>
              <div className="flex flex-col gap-3">
                {TAMANHOS.map((t) => (
                  <OpcaoBotao
                    key={t.id}
                    ativo={tamanho === t.id && !tamanhoCustom}
                    onClick={() => escolherTamanho(t.id)}
                  >
                    {t.label}
                  </OpcaoBotao>
                ))}

                <div className={`border px-6 py-4 ${tamanhoCustom ? "border-black" : "border-black/20"}`}>
                  <p className="text-[16px] mb-3">Tamanho personalizado</p>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-[13px] text-black/60">Largura (cm)</span>
                      <input
                        type="number"
                        min={1}
                        value={larguraInput}
                        onChange={(e) => setLarguraInput(e.target.value)}
                        className="border border-black/30 px-3 py-2 text-[16px] bg-transparent w-[110px]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[13px] text-black/60">Altura (cm)</span>
                      <input
                        type="number"
                        min={1}
                        value={alturaInput}
                        onChange={(e) => setAlturaInput(e.target.value)}
                        className="border border-black/30 px-3 py-2 text-[16px] bg-transparent w-[110px]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={confirmarTamanhoPersonalizado}
                      disabled={!larguraInput || !alturaInput}
                      className="bg-black text-white px-6 py-3 text-[15px] disabled:opacity-40"
                    >
                      Usar este tamanho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {etapa === "material" && (
            <div>
              <h1 className="text-[clamp(22px,5vw,36px)] mb-[32px] text-center">Qual material?</h1>
              <div className="flex flex-col gap-3">
                {MATERIAIS.map((m) => (
                  <OpcaoBotao key={m.id} ativo={material === m.id} onClick={() => escolherMaterial(m.id)}>
                    {m.label}
                  </OpcaoBotao>
                ))}
              </div>
            </div>
          )}

          {etapa === "moldura" && (
            <div>
              <h1 className="text-[clamp(22px,5vw,36px)] mb-[32px] text-center">Qual moldura?</h1>
              <div className="flex flex-col gap-3">
                {MOLDURAS.map((m) => (
                  <OpcaoBotao key={m.id} ativo={moldura === m.id} onClick={() => escolherMoldura(m.id)}>
                    <span className="flex items-center gap-3">
                      {m.cor && (
                        <span
                          className="w-5 h-5 inline-block shrink-0"
                          style={{ background: m.cor }}
                          aria-hidden="true"
                        />
                      )}
                      {m.label}
                    </span>
                  </OpcaoBotao>
                ))}
              </div>
            </div>
          )}

          {etapa === "revisao" && (
            <div className="flex flex-col md:flex-row gap-[42px] items-center md:items-start">
              <div className="w-full md:w-[400px] shrink-0 bg-[#f2f2ef] p-[8%]">
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
                    hue={produtoSelecionado?.hue ?? 200}
                    orientacao={produtoSelecionado?.orientacao ?? "retrato"}
                    molduraColor={molduraAtual?.cor ?? null}
                  />
                )}
              </div>

              <div className="flex-1 w-full">
                <h1 className="text-[28px] mb-[17px]">Revise seu quadro</h1>
                <p className="text-[20px] mb-[11px]">{nomeItem}</p>
                <ul className="text-[16px] text-black/70 mb-[24px] flex flex-col gap-1">
                  <li>Tamanho: {tamanhoLabelAtual}</li>
                  <li>Material: {MATERIAIS.find((m) => m.id === material)?.label}</li>
                  <li>Moldura: {MOLDURAS.find((m) => m.id === moldura)?.label}</li>
                </ul>

                <div className="flex items-center border border-black w-fit mb-[24px]">
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

                <p className="text-[32px] mb-[24px]">
                  {preco !== null ? formatarPreco(preco * quantidade) : "—"}
                </p>

                <button
                  type="button"
                  onClick={() => setFinalizando(true)}
                  className="w-full bg-black text-white px-6 py-4 text-[16px] tracking-artu mb-[17px]"
                >
                  Finalizar Compra
                </button>

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
            </div>
          )}
        </div>
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
