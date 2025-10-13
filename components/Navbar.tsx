"use client";
import Link from "next/link";

export default function Navbar() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";
  return (
    <header className="flex items-center justify-between py-6">
      <Link href="/" className="text-xl font-semibold">GoodBlue</Link>
      <nav className="flex items-center gap-6">
        <Link href="#frameworks" className="text-sm text-gray-700 hover:text-gray-900">Frameworks</Link>
        <Link href="#pricing" className="text-sm text-gray-700 hover:text-gray-900">Pricing</Link>
        <a
          href={appUrl}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          target="_blank" rel="noopener noreferrer"
        >
          Try the App
        </a>
      </nav>
    </header>
  );
}
