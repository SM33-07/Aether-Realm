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
  title: "Aether Realm — Soham More | Software Engineer & Interactive Portfolio",
  description:
    "Software Engineer building interactive experiences, developer tools, and production-ready web applications. Explore Aether Realm, an explorable 3D portfolio featuring full-stack engineering work, systems, and technical leadership.",
  openGraph: {
    title: "Aether Realm — Soham More | Software Engineer Portfolio",
    description:
      "Explorable 3D developer portfolio showcasing full-stack projects, systems, developer tools, and technical leadership by Soham More.",
    siteName: "Aether Realm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether Realm — Soham More | Software Engineer Portfolio",
    description:
      "Software Engineer building interactive experiences, developer tools, and production-ready web applications.",
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
