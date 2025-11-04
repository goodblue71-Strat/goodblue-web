import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoodBlue — Strategy, generated in minutes",
  description: "Turn market inputs into board-ready insights and slides with AI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full bg-gray-50 text-gray-900 antialiased font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
