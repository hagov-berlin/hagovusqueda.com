import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import FAQs from "@/components/common/faqs";
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
          <div className={styles.headerContainer}>
            <header className={styles.header}>
              <Link href="/" className={styles.logo} />
              <Link href="/videos">Videos</Link>
            </header>
          </div>
          <main>{children}</main>
          <footer className={styles.footer}>
            <FAQs />
          </footer>
          {/* <footer /> Footer with links to all channels and shows */}
        </div>
      </body>
    </html>
  );
}
