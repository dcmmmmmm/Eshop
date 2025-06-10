import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/providers/SessionProvider";
import { Toaster } from "react-hot-toast";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eshop",
  description: "Nơi bán đồ công nghệ online uy tín",
};

import { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AuthProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Toaster/>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </AuthProvider>
      </body>
    </html>
  );
}
