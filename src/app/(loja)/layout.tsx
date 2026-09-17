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

export default async function LojaLayout({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();

  return (
    <>
      <AnnouncementBar>
        Frete grátis para compras acima de R$ 400 — em até 12x sem juros
      </AnnouncementBar>
      <Nav sessao={sessao} />
      <div className="hidden md:block">
        <CircularCategories />
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
