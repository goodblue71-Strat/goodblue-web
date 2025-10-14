"use client";
import Link from "next/link";

export default function Navbar() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";
  return (
    <header className="w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6 min-w-0">
          <Link href="/" className="text-xl font-semibold shrink-0">
            GoodBlue
          </Link>

          <nav className="flex items-center gap-6 flex-wrap min-w-0">
            <Link href="#frameworks" className="text-sm text-gray-700 hover:text-gray-900">
              Frameworks
            </Link>
            <Link href="/Pricing" className="text-sm text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 whitespace-nowrap"
            >
              Try the App
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
