import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/layout/header";
// import Footer from "@/components/layout/footer";
import styles from "./layout.module.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HAGOVusqueda",
  description: "Buscador del registro hagovero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script async type="text/javascript" src="/newrelic.js" />
        <div className={styles.pageContainer}>
          <Header />
          <main>{children}</main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
