import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI Engineer Portfolio",
  description: "AI Engineer portfolio showcasing projects, skills, and experience in machine learning and artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={jetbrainsMono.className}>
        <Loading />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
