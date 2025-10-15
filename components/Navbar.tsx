// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Detect if inside an iframe (like Streamlit)
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  // Helper: dynamic target (open in new tab if embedded)
  const target = isEmbedded ? "_blank" : "_self";

  return (
    <header className="w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6 min-w-0">
          <a
            href="https://goodblue.ai/"
            target={target}
            rel="noopener noreferrer"
            className="text-xl font-semibold shrink-0"
          >
            GoodBlue
          </a>

          <nav className="flex items-center gap-6 flex-wrap min-w-0">
            <a
              href="https://goodblue.ai/"
              target={target}
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Home
            </a>
            <a
              href="https://goodblue.ai/#frameworks"
              target={target}
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Frameworks
            </a>
            <a
              href="https://goodblue.ai/Pricing"
              target={target}
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Pricing
            </a>

            {/* Only show button if not embedded in Streamlit */}
            {!isEmbedded && (
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 whitespace-nowrap"
              >
                Try the App
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
