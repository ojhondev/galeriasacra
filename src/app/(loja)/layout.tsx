import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { CircularCategories } from "@/components/CircularCategories";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CadastroPopup } from "@/components/CadastroPopup";
import { AvisoWhatsappBar } from "@/components/AvisoWhatsappBar";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { obterSessao } from "@/lib/session";
import { listarColecoesAtivas } from "@/lib/colecoes";
import { obterConfigLoja } from "@/lib/frete";
import { formatarPreco } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function LojaLayout({ children }: { children: React.ReactNode }) {
  const [sessao, colecoes, configLoja] = await Promise.all([
    obterSessao(),
    listarColecoesAtivas(),
    obterConfigLoja(),
  ]);

  return (
    <>
      <AnnouncementBar>
        Frete grátis para compras acima de {formatarPreco(configLoja.freteGratisMinimo)} — em até 12x sem
        juros
      </AnnouncementBar>
      <Nav sessao={sessao} colecoes={colecoes} />
      <div className="hidden md:block">
        <CircularCategories colecoes={colecoes} />
      </div>
      <main className="flex-1 pb-[64px] md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav sessao={sessao} />
      <AvisoWhatsappBar />
      <CadastroPopup />
      <PushNotificationManager />
    </>
  );
}
