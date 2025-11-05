"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      alert("Error generating Market Structure (Mekko) analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 transition-all">
          <h1 className="text-4xl font-bold mb-2 text-center text-cyan-700">
            Market Structure (Mekko) Generator
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Visualize market segments, growth, and competitive whitespace
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Market */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market or Industry
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., AI SaaS, Energy Tech"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                required
              />
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product or Offering
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Strategy Copilot"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            {/* Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Area (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., growth, fragmentation, whitespace"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., North America, Global"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., emphasize segments with >20% CAGR or whitespace for new entrants"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-gray-400 transition-all"
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
