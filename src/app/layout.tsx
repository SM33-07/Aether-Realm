import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Aether Realm — Soham More's Portfolio",
  description:
    "An immersive 3D game-portfolio experience. Explore zones, meet Keepers, and discover projects, skills, and more.",
  openGraph: {
    title: "Aether Realm — Soham More's Portfolio",
    description:
      "An immersive 3D game-portfolio. Explore the Forge, Archives, Oracle, and Gateway.",
    siteName: "Aether Realm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether Realm — Soham More's Portfolio",
    description:
      "An immersive 3D game-portfolio experience built with Next.js, Three.js, and React Three Fiber.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
