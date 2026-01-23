"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SWOTPage() {
  const pathname = usePathname();
  const router = useRouter();
  const showCTA = pathname !== "/tryapp" && pathname !== "/app/tryapp";

  useEffect(() => {
    router.push("/comp");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />
      {/* Nothing renders here because we navigate away */}
      <Footer />
    </div>
  );
}
