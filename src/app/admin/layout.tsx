import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { obterSessao } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();

  if (sessao?.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return <AdminShell sessao={sessao}>{children}</AdminShell>;
}
