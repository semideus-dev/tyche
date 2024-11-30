import "@/styles/globals.css";
import { cn } from "@/lib/utils";

import localfont from "next/font/local";
import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Tyche",
  description: "AI-powered financial advisor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const appFont = localfont({
  src: "./fonts/AppFont.ttf",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(appFont.className)}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
