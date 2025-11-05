"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { generatePorter } from "../../lib/api"; // you'll define this API call similar to generateTAM

export default function PorterPage() {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/porters" && pathname !== "/app/porters";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generatePorter({
        company,
        product,
        industry,
        region,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "porterResult",
        JSON.stringify({
          company,
          product,
          industry,
          region,
          porters_analysis: data.porters_analysis,
        })
      );

      router.push("/porters/results");
    } catch (err) {
      console.error(err);
      alert("Error generating Porter’s Five Forces analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            Porter’s Five Forces Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name (e.g., GoodBlue AI)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            {/* Product Name */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product or offering (e.g., AI Strategy Copilot)"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />

            {/* Industry */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Industry or market (e.g., AI SaaS, Energy Tech)"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />

            {/* Region */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Region (e.g., North America, Global)"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />

            {/* Optional prompt */}
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional context or assumptions (e.g., focus on how supplier dependency affects competition)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Analyzing..." : "Generate 5 Forces Analysis"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
