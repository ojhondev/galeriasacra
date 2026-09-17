import type { Produto } from "@/lib/products";

const CATEGORIAS = ["Quadros Religiosos", "Ícones Marianos", "Santos"];

export function ProdutoForm({
  produto,
  action,
}: {
  produto?: Produto;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-[17px] max-w-xl">
      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">SKU</span>
        <input
          name="sku"
          defaultValue={produto?.sku}
          required
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">SLUG (URL)</span>
        <input
          name="slug"
          defaultValue={produto?.slug}
          required
          pattern="[a-z0-9-]+"
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">NOME</span>
        <input
          name="nome"
          defaultValue={produto?.nome}
          required
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">CATEGORIA</span>
        <select
          name="categoria"
          defaultValue={produto?.categoria ?? CATEGORIAS[0]}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">DESCRIÇÃO CURTA</span>
        <input
          name="descricaoCurta"
          defaultValue={produto?.descricaoCurta}
          required
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">DESCRIÇÃO LONGA (um parágrafo por linha)</span>
        <textarea
          name="descricaoLonga"
          defaultValue={produto?.descricaoLonga.join("\n")}
          required
          rows={4}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">PREÇO BASE (R$)</span>
        <input
          type="number"
          name="precoBase"
          defaultValue={produto?.precoBase}
          required
          min={0}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">ESTOQUE (unidades físicas disponíveis)</span>
        <input
          type="number"
          name="estoque"
          defaultValue={produto?.estoque ?? 10}
          required
          min={0}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">ORIENTAÇÃO</span>
        <select
          name="orientacao"
          defaultValue={produto?.orientacao ?? "retrato"}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        >
          <option value="retrato">Retrato</option>
          <option value="paisagem">Paisagem</option>
          <option value="quadrado">Quadrado</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[16px] tracking-artu">HUE (0-360, cor de placeholder)</span>
        <input
          type="number"
          name="hue"
          defaultValue={produto?.hue ?? 200}
          min={0}
          max={360}
          className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="ativo" defaultChecked={produto?.ativo ?? true} />
        <span className="text-[16px] tracking-artu">ATIVO (visível na loja)</span>
      </label>

      <button
        type="submit"
        className="bg-black text-white px-8 py-4 text-[18px] tracking-artu mt-4 self-start"
      >
        SALVAR
      </button>
    </form>
  );
}
