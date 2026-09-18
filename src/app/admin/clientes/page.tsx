import { listarClientes, listarLeads } from "@/lib/clientes";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const [clientes, leads] = await Promise.all([listarClientes(), listarLeads()]);

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Clientes</h1>

      <p className="text-[16px] mb-3">Clientes cadastrados ({clientes.length})</p>
      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden mb-[48px]">
        {clientes.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhum cliente cadastrado ainda.</p>
        ) : (
          clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div>
                <p className="text-[15px]">
                  {cliente.nome}{" "}
                  {cliente.role === "admin" && (
                    <span className="text-[11px] text-white bg-black px-2 py-0.5 rounded-[6px] ml-1">
                      admin
                    </span>
                  )}
                </p>
                <p className="text-[13px] text-black/50">
                  {cliente.email} {cliente.whatsapp && `· ${cliente.whatsapp}`}
                </p>
              </div>
              <p className="text-[13px] text-black/40">
                {new Date(cliente.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>

      <p className="text-[16px] mb-2">Leads do pop-up ({leads.length})</p>
      <p className="text-[14px] text-black/50 mb-3 max-w-2xl">
        Pessoas que deixaram e-mail e WhatsApp no pop-up de cadastro, sem criar conta.
      </p>
      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
        {leads.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhum lead ainda.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div>
                <p className="text-[15px]">{lead.email}</p>
                <p className="text-[13px] text-black/50">{lead.whatsapp}</p>
              </div>
              <p className="text-[13px] text-black/40">
                {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
