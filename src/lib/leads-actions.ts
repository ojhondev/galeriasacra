"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { leads } from "@/db/schema";

export async function inscreverLeadAction(email: string, whatsapp: string): Promise<{ ok: boolean }> {
  const emailNormalizado = email.trim().toLowerCase();
  const whatsappNormalizado = whatsapp.trim();
  if (!emailNormalizado || !whatsappNormalizado) return { ok: false };

  await db
    .insert(leads)
    .values({ email: emailNormalizado, whatsapp: whatsappNormalizado })
    .onConflictDoUpdate({
      target: leads.email,
      set: { whatsapp: whatsappNormalizado },
    });

  revalidatePath("/admin/clientes");
  return { ok: true };
}
