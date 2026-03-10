import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "react-datepicker/dist/react-datepicker.css";
import { ClientProviders } from "./clientProviders";
import { CurrentUserProvider } from "./currentUserProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Doctr",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>
          <CurrentUserProvider>{children}</CurrentUserProvider>
        </ClientProviders>
      </body>
    </html>
  );
}

export const fetchCache = "force-no-store";
export const revalidate = 0;
