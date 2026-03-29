import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMS Dashboard - 0xfzz",
  description: "Secure CMS for 0xfzz portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaCode.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono selection:bg-[#1a1a1a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
