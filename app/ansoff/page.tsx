"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { generateAnsoff } from "../../lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AnsoffPage() {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [market, setMarket] = useState("");
  const [goal, setGoal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/ansoff" && pathname !== "/app/ansoff";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateAnsoff({
        company,
        product,
        market,
        goal,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "ansoffResult",
        JSON.stringify({
          company,
          product,
          market,
          goal,
          ansoff_analysis: data.ansoff_analysis,
        })
      );

      router.push("/ansoff/results");
    } catch (err) {
      console.error(err);
      alert("Error generating Ansoff Matrix");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h1 className="text-4xl font-bold mb-3 text-center text-blue-700">
            Ansoff Matrix Generator
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Explore <span className="font-semibold text-blue-600">Market & Product Growth</span> strategies using
            the Ansoff Matrix. Enter your details below to generate tailored insights.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name (e.g., GoodBlue AI)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product or service (e.g., AI Strategy Copilot)"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Target market (e.g., SMBs in North America)"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                required
              />
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Goal (e.g., expand into new markets, increase revenue share)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes or context (e.g., current growth challenges or focus areas)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 transition-all"
            >
              {loading ? "Generating..." : "Generate Ansoff Matrix"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
