import type { Metadata } from "next";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  useUser,
} from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Header from "./componenets/header";
import { Toaster } from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePresence } from "./hooks/usePresence";

const SFPROTEXTFont = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro-Text-Bold.otf",
      style: "normal",
      weight: "700",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Semibold.otf",
      style: "normal",
      weight: "600",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Regular.otf",
      style: "normal",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--font-apple",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${SFPROTEXTFont.variable}`} suppressHydrationWarning>
          <Toaster position="top-center" />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Providers>
              <ClerkLoading>
                <div className="loading-page"></div>
              </ClerkLoading>
              <ClerkLoaded>
                <Header />
                {children}
              </ClerkLoaded>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
