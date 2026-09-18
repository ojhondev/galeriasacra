import { listarSolicitacoesRestauro } from "@/lib/restauro";
import { atualizarStatusRestauroAction } from "@/lib/restauro-actions";
import { STATUS_RESTAURO, STATUS_RESTAURO_LABEL, STATUS_RESTAURO_COR } from "@/lib/restauro-shared";

export const dynamic = "force-dynamic";

export default async function AdminRestaurosPage() {
  const solicitacoes = await listarSolicitacoesRestauro();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Restauros</h1>

      {solicitacoes.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-[6px] px-5 py-8 text-center">
          <p className="text-[15px] text-black/50">
            Nenhuma solicitação ainda. Solicitações aparecem aqui assim que um cliente completa o
            fluxo &quot;Restaure Seu Quadro&quot;.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
          {solicitacoes.map((solicitacao) => (
            <div key={solicitacao.id} className="border-b border-black/10 last:border-0 px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[16px]">{solicitacao.numero}</p>
                  <p className="text-[13px] text-black/50">
                    {new Date(solicitacao.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <span
                  className="text-[12px] text-white px-2.5 py-1 rounded-[6px] shrink-0"
                  style={{ background: STATUS_RESTAURO_COR[solicitacao.status] }}
                >
                  {STATUS_RESTAURO_LABEL[solicitacao.status]}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-[14px] text-black/70 mb-3">
                <p><span className="text-black/50">Cliente:</span> {solicitacao.nome}</p>
                <p><span className="text-black/50">E-mail:</span> {solicitacao.email}</p>
                <p><span className="text-black/50">WhatsApp:</span> {solicitacao.whatsapp}</p>
                <p><span className="text-black/50">Tipo de obra:</span> {solicitacao.tipoObra}</p>
                <p>
                  <span className="text-black/50">Dimensões:</span>{" "}
                  {solicitacao.largura && solicitacao.altura
                    ? `${solicitacao.largura}x${solicitacao.altura}cm`
                    : "não informadas"}
                </p>
                <p><span className="text-black/50">Fotos anexadas:</span> {solicitacao.quantidadeFotos}</p>
                <p><span className="text-black/50">Urgência:</span> {solicitacao.urgencia}</p>
                <p className="md:col-span-2">
                  <span className="text-black/50">Problemas:</span> {solicitacao.tiposDano.join(", ")}
                </p>
                {solicitacao.descricao && (
                  <p className="md:col-span-2">
                    <span className="text-black/50">Descrição:</span> {solicitacao.descricao}
                  </p>
                )}
              </div>

              <form action={atualizarStatusRestauroAction} className="flex items-center gap-3">
                <input type="hidden" name="id" value={solicitacao.id} />
                <select
                  name="status"
                  defaultValue={solicitacao.status}
                  className="border border-black/20 rounded-[6px] px-3 py-1.5 text-[13px] bg-transparent outline-none"
                >
                  {STATUS_RESTAURO.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_RESTAURO_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button type="submit" className="border border-black px-4 py-1.5 text-[13px] rounded-[6px]">
                  Atualizar
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
