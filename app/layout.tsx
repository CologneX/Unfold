import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/custom/header";
import { DialogProvider } from "@/components/custom/app-dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unfold",
  description:
    "A modern platform for creating, managing, and showcasing your professional portfolio and curriculum vitae.",
  openGraph: {
    title: "Unfold",
    description:
      "A modern platform for creating, managing, and showcasing your professional portfolio and curriculum vitae.",
    url: "https://unfold.com",
    siteName: "Unfold",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-svh bg-black/[0.90]`}
      >
        <header className="fixed top-0 z-50 translate-y-4 left-0 right-0 max-w-xl mx-auto px-4">
          <Header />
        </header>
        <DialogProvider />
        <main className="flex-grow z-0">{children}</main>
      </body>
    </html>
  );
}
