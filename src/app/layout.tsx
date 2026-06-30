import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { TabBar } from "@/components/TabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ingresso • Cinépolis Guararapes",
  description:
    "Compre ingressos de cinema do Shopping Guararapes: filmes em cartaz, horários, poltronas e pagamento.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0d12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} antialiased`}>
      <body className="overflow-x-hidden bg-black">
        <BookingProvider>
          <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col overflow-x-hidden bg-background shadow-2xl shadow-black">
            <main className="flex-1 pb-[max(6rem,calc(5rem+env(safe-area-inset-bottom)))]">
              {children}
            </main>
            <TabBar />
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
