import type { Metadata } from "next";
import { Geist, Geist_Mono, Germania_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const germaniaOne = Germania_One({
  variable: "--font-germania-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HagoVusqueda",
  description: "Buscador del registro hagovero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${germaniaOne.variable}`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
