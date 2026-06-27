import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} antialiased`}>
      <body className="bg-black">
        <BookingProvider>
          <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background shadow-2xl shadow-black">
            <main className="flex-1 pb-24">{children}</main>
            <TabBar />
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
