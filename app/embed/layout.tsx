// app/embed/layout.tsx
import type { ReactNode } from "react";
import "@/app/globals.css"; // ensures Tailwind + global styles load

export const metadata = {
  title: "GoodBlue Embed",
  description: "Embedded components from GoodBlue.ai",
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Make all links inside the iframe open in the top (Streamlit) window */}
        <base target="_top" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "transparent",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
