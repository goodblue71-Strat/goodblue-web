"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { generateMekko } from "../../lib/api";

export default function MekkoPage() {
  const [market, setMarket] = useState("");
  const [product, setProduct] = useState("");
  const [focus, setFocus] = useState("");
  const [region, setRegion] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/mekko" && pathname !== "/app/mekko";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateMekko({
        market,
        product,
        focus: focus || undefined,
        region: region || undefined,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "mekkoResult",
        JSON.stringify({
          market,
          product,
          focus,
          region,
          mekko_analysis: data.mekko_analysis,
        })
      );

      router.push("/mekko/results");
    } catch (err) {
      console.error(err);
      alert("Error generating Market Structure (Mekko) Analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-cyan-700">
            Market Structure (Mekko) Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Market */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Market or industry (e.g., AI SaaS, Energy Tech)"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              required
            />

            {/* Product */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Product or offering (e.g., Strategy Copilot)"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />

            {/* Optional focus */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Optional focus area (e.g., growth, competitive whitespace)"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />

            {/* Optional region */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Optional region (e.g., North America, Global)"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />

            {/* Optional prompt */}
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Optional custom prompt (e.g., focus on fragmented segments or whitespace)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            ></textarea>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white font-semibold py-3 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Analyzing..." : "Generate Market Structure (Mekko)"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
