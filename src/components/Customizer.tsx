"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
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
import { produtos, type Produto } from "@/lib/products";

type CustomizerProps = {
  produtoInicial?: Produto;
  permitirTrocarImagem?: boolean;
};

export function Customizer({ produtoInicial, permitirTrocarImagem = false }: CustomizerProps) {
  const router = useRouter();
  const { adicionar } = useCart();

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>(produtoInicial);
  const [imagemPropria, setImagemPropria] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<TamanhoId>("40x60");
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const [material, setMaterial] = useState<MaterialId>("tela-canvas");
  const [adicionado, setAdicionado] = useState(false);

  const precoBase = produtoSelecionado?.precoBase ?? 349;
  const nomeItem = imagemPropria
    ? "Quadro personalizado (imagem própria)"
    : produtoSelecionado?.nome ?? "Monte Seu Quadro";

  const preco = useMemo(
    () => calcularPreco(precoBase, tamanho, moldura, material),
    [precoBase, tamanho, moldura, material],
  );

  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);

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
    <div className="grid md:grid-cols-2 gap-8 md:gap-[32px]">
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

      <div className="flex flex-col gap-8">
        <div>
          <p className="text-[24px] leading-tight">{nomeItem}</p>
          <p className="text-[20px] mt-2">{formatarPreco(preco)}</p>
        </div>

        {permitirTrocarImagem && (
          <div>
            <p className="text-[18px] tracking-artu mb-[11px]">IMAGEM</p>
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
          </div>
        )}

        <div>
          <p className="text-[18px] tracking-artu mb-[11px]">TAMANHO</p>
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
        </div>

        <div>
          <p className="text-[18px] tracking-artu mb-[11px]">MOLDURA</p>
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
        </div>

        <div>
          <p className="text-[18px] tracking-artu mb-[11px]">MATERIAL</p>
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
        </div>

        <div className="flex items-center gap-x-8 pt-4 border-t border-black">
          <button
            type="button"
            onClick={handleAdicionar}
            className="text-[18px] tracking-artu underline"
          >
            ADICIONAR AO CARRINHO
          </button>
          {adicionado && (
            <button
              type="button"
              onClick={() => router.push("/carrinho")}
              className="text-[18px] tracking-artu text-[var(--color-signal-red)] underline"
            >
              VER CARRINHO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
