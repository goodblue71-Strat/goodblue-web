// app/embed/footer/layout.tsx
import type { ReactNode } from "react";
import "@/app/globals.css"; // <-- ensure Tailwind/global styles load

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Make links inside the iframe open the parent (Streamlit) window */}
      <head><base target="_parent" /></head>
      <body style={{ margin: 0, padding: 0, background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
