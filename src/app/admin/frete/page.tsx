import { listarFaixasFrete, obterConfigLoja } from "@/lib/frete";
import { criarFaixaFreteAction, atualizarConfigFreteAction } from "@/lib/frete-actions";
import { FaixaFreteRow } from "@/components/admin/FaixaFreteRow";
import { formatarPreco } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminFretePage() {
  const [faixas, configLoja] = await Promise.all([listarFaixasFrete(), obterConfigLoja()]);

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Frete</h1>

      <p className="text-[16px] mb-3">Frete grátis</p>
      <form
        action={atualizarConfigFreteAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-[48px]"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Valor mínimo do pedido (R$)</span>
          <input
            type="number"
            name="freteGratisMinimo"
            defaultValue={configLoja.freteGratisMinimo}
            min={0}
            required
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[160px]"
          />
        </label>
        <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
          Salvar
        </button>
        <p className="text-[13px] text-black/50 w-full">
          Usado no aviso do topo do site, na página do produto e nos ícones da home. Atual:{" "}
          {formatarPreco(configLoja.freteGratisMinimo)}.
        </p>
      </form>

      <p className="text-[16px] mb-2">Faixas de frete por região (CEP)</p>
      <p className="text-[14px] text-black/50 mb-3 max-w-2xl">
        Uma faixa por primeiro dígito do CEP (0 a 9). Cadastrar com um prefixo já existente atualiza a
        faixa.
      </p>

      <form
        action={criarFaixaFreteAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Prefixo do CEP (0-9)</span>
          <input
            name="prefixoCep"
            required
            pattern="[0-9]"
            maxLength={1}
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[80px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Região</span>
          <input
            name="regiao"
            required
            placeholder="Ex: Grande São Paulo"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[220px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Prazo</span>
          <input
            name="prazo"
            required
            placeholder="Ex: 2 a 4 dias úteis"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[180px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Valor (R$)</span>
          <input
            type="number"
            name="valor"
            required
            min={0}
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[120px]"
          />
        </label>

        <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
          Salvar faixa
        </button>
      </form>

      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
        {faixas.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhuma faixa de frete cadastrada.</p>
        ) : (
          faixas.map((faixa) => <FaixaFreteRow key={faixa.id} faixa={faixa} />)
        )}
      </div>
    </div>
  );
}
