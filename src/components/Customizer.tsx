"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
import { ARPreview } from "@/components/ARPreview";
import { useCart } from "@/lib/cart";
import {
  MATERIAIS,
  MOLDURAS,
  TAMANHOS,
  calcularPreco,
  formatarPreco,
  type MaterialId,
  type MolduraId,
  type TamanhoId,
} from "@/lib/pricing";
import { produtos, type Produto, type Orientacao } from "@/lib/products";

function aspectRatioDoTamanho(tamanhoId: TamanhoId, orientacao: Orientacao): number {
  if (orientacao === "quadrado") return 1;
  const [a, b] = tamanhoId.split("x").map(Number);
  const [largura, altura] = orientacao === "paisagem" ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
  return largura / altura;
}

type CustomizerProps = {
  produtoInicial?: Produto;
  permitirTrocarImagem?: boolean;
  ocultarImagem?: boolean;
  onMolduraChange?: (cor: string | null) => void;
};

function Linha({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-x-6 py-[17px] border-t border-black">
      <p className="text-[18px] tracking-artu">{label}</p>
      <div>{children}</div>
    </div>
  );
}

export function Customizer({
  produtoInicial,
  permitirTrocarImagem = false,
  ocultarImagem = false,
  onMolduraChange,
}: CustomizerProps) {
  const router = useRouter();
  const { adicionar } = useCart();

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>(produtoInicial);
  const [imagemPropria, setImagemPropria] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<TamanhoId>("40x60");
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const [material, setMaterial] = useState<MaterialId>("tela-canvas");
  const [adicionado, setAdicionado] = useState(false);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const precoBase = produtoSelecionado?.precoBase ?? 349;
  const nomeItem = imagemPropria
    ? "Quadro personalizado (imagem própria)"
    : produtoSelecionado?.nome ?? "Monte Seu Quadro";

  const preco = useMemo(
    () => calcularPreco(precoBase, tamanho, moldura, material),
    [precoBase, tamanho, moldura, material],
  );

  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const aspectRatio = aspectRatioDoTamanho(tamanho, produtoSelecionado?.orientacao ?? "retrato");

  useEffect(() => {
    onMolduraChange?.(molduraAtual?.cor ?? null);
  }, [molduraAtual, onMolduraChange]);

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setImagemPropria(URL.createObjectURL(arquivo));
    setNomeArquivo(arquivo.name);
    setProdutoSelecionado(undefined);
  }

  function handleAdicionar() {
    adicionar({
      nome: nomeItem,
      hue: produtoSelecionado?.hue ?? 200,
      tamanho,
      tamanhoLabel: TAMANHOS.find((t) => t.id === tamanho)!.label,
      moldura,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material,
      materialLabel: MATERIAIS.find((m) => m.id === material)!.label,
      personalizado: permitirTrocarImagem || moldura !== "sem-moldura" || material !== "tela-canvas",
      precoUnitario: preco,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2500);
  }

  return (
    <div className={ocultarImagem ? "" : "grid md:grid-cols-2 gap-8 md:gap-[32px]"}>
      {!ocultarImagem && (
        <div>
          {imagemPropria ? (
            <div
              style={
                molduraAtual?.cor
                  ? { background: molduraAtual.cor, padding: "3.2%" }
                  : undefined
              }
            >
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
      )}

      <div>
        <div className="flex items-baseline justify-between border-b border-black pb-[17px]">
          <p className="text-[24px] md:text-[32px] leading-tight">{nomeItem}</p>
          <p className="text-[20px] md:text-[24px]">{formatarPreco(preco)}</p>
        </div>

        {permitirTrocarImagem && (
          <Linha label="IMAGEM">
            <div className="grid grid-cols-4 gap-2 mb-[17px]">
              {produtos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProdutoSelecionado(p);
                    setImagemPropria(null);
                  }}
                  aria-label={p.nome}
                  className="block group"
                  style={{
                    outline:
                      produtoSelecionado?.id === p.id && !imagemPropria
                        ? "2px solid black"
                        : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <ArtPlate hue={p.hue} orientacao={p.orientacao} hoverZoom />
                </button>
              ))}
            </div>
            <label className="text-[18px] tracking-artu underline cursor-pointer">
              ENVIAR IMAGEM PRÓPRIA
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            {nomeArquivo && <p className="text-[18px] mt-2 text-black/60">{nomeArquivo}</p>}
          </Linha>
        )}

        <Linha label="TAMANHO">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {TAMANHOS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTamanho(t.id)}
                className={`text-[18px] tracking-artu pb-1 ${
                  tamanho === t.id ? "border-b border-black" : "text-black/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Linha>

        <Linha label="MOLDURA">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {MOLDURAS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMoldura(m.id)}
                className={`text-[18px] tracking-artu pb-1 ${
                  moldura === m.id ? "border-b border-black" : "text-black/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Linha>

        <Linha label="MATERIAL">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {MATERIAIS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMaterial(m.id)}
                className={`text-[18px] tracking-artu pb-1 ${
                  material === m.id ? "border-b border-black" : "text-black/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Linha>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-[17px] border-t border-b border-black">
          <button
            type="button"
            onClick={handleAdicionar}
            className="text-[18px] tracking-artu underline"
          >
            ADICIONAR AO CARRINHO
          </button>
          <button
            type="button"
            onClick={() => setTestandoAmbiente(true)}
            className="text-[18px] tracking-artu underline"
          >
            TESTAR NO MEU AMBIENTE
          </button>
          {adicionado && (
            <button
              type="button"
              onClick={() => router.push("/carrinho")}
              className="text-[18px] tracking-artu text-[var(--color-brand)] underline"
            >
              VER CARRINHO
            </button>
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
