import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-redhat",
});

export const metadata: Metadata = {
  title: "Galeria Sacra",
  description:
    "Galeria Sacra — arte sacra contemporânea. Quadros religiosos prontos ou totalmente personalizados, do seu jeito.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`h-full antialiased ${redHatDisplay.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
