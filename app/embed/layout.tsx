// app/embed/layout.tsx
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata = {
  title: "GoodBlue Embed",
  description: "Embedded components from GoodBlue.ai",
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <base target="_top" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure all anchors escape the iframe
              document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('a[href]').forEach(a => {
                  if (!a.target) a.target = '_top';
                });
              });

              // Fallback: force top navigation on click (and postMessage as last resort)
              document.addEventListener('click', (e) => {
                const a = e.target.closest('a[href]');
                if (!a) return;
                const href = a.getAttribute('href');
                if (!href) return;
                try {
                  window.top.location.href = href;
                  e.preventDefault();
                } catch {
                  try {
                    window.parent.postMessage({ type: 'goodblue:navigate', href }, '*');
                    e.preventDefault();
                  } catch {}
                }
              }, true);
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "transparent", fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
