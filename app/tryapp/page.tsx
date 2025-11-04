"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Frameworks from "@/components/Frameworks";
import { usePathname } from "next/navigation";

export default function SWOTPage() {
  const pathname = usePathname();
  const showCTA = pathname !== "/tryapp" && pathname !== "/app/tryapp";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar showCTA={showCTA} />

      {/* Main Section with Frameworks in the middle */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Frameworks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
