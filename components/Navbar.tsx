// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NavbarProps {
  showCTA?: boolean; // optional prop to toggle "Try the App" button
}

export default function Navbar({ showCTA = true }: NavbarProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      // Detect if running inside an iframe (e.g. Streamlit embed)
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  const target = isEmbedded ? "_blank" : "_self";

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <a
            href="https://goodblue.ai/"
            target={target}
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <Image
              src="/favicon.ico"
              alt="GoodBlue logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              GoodBlue
            </span>
          </a>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <a
              href="https://goodblue.ai/"
              target={target}
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="https://goodblue.ai/#frameworks"
              target={target}
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Frameworks
            </a>
            <a
              href="https://goodblue.ai/Pricing"
              target={target}
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Pricing
            </a>

            {/* Try App Button (hidden if embedded or showCTA=false) */}
            {!isEmbedded && showCTA && (
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700 transition-colors whitespace-nowrap"
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
