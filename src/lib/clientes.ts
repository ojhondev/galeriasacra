import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { usuarios, leads } from "@/db/schema";

export async function listarClientes() {
  return db.query.usuarios.findMany({
    orderBy: [desc(usuarios.createdAt)],
    columns: { id: true, nome: true, email: true, whatsapp: true, role: true, createdAt: true },
  });
}

export async function listarLeads() {
  return db.query.leads.findMany({ orderBy: [desc(leads.createdAt)] });
}
