import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Define a shim for window.ethereum to avoid runtime errors from browser extensions */}
      <head>
        <Script id="ethereum-shim" strategy="beforeInteractive">
          {`window.ethereum = window.ethereum || {};`}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
