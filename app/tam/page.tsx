"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateTAM } from "../../lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function TAMPage() {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [feature, setFeature] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [segment, setSegment] = useState("");
  const [avgSpend, setAvgSpend] = useState("");
  const [adoption, setAdoption] = useState("");
  const [targetShare, setTargetShare] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/tam" && pathname !== "/app/tam";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateTAM({
        company,
        product,
        feature: feature || undefined,
        industry,
        region,
        segment,
        avgSpend: avgSpend || undefined,
        adoption: adoption || undefined,
        targetShare: targetShare || undefined,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "tamResult",
        JSON.stringify({
          company,
          product,
          industry,
          region,
          segment,
          tam_sam_som_analysis: data.tam_sam_som_analysis,
        })
      );

      router.push("/tam/results");
    } catch (err) {
      console.error(err);
      alert("Error generating TAM/SAM/SOM analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            TAM / SAM / SOM Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company and Product */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name (e.g., GoodBlue AI)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product or offering (e.g., AI Strategy Copilot)"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Feature (optional, e.g., SWOT generator)"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
            />

            {/* Market Scope */}
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Industry or market (e.g., AI SaaS, Energy Tech)"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Target region (e.g., North America, Global)"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Customer segment (e.g., SMBs, Consulting firms)"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              required
            />

            {/* Optional numeric inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Avg spend per customer ($/year, optional)"
                value={avgSpend}
                onChange={(e) => setAvgSpend(e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adoption rate (%) (optional)"
                value={adoption}
                onChange={(e) => setAdoption(e.target.value)}
              />
            </div>

            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Target share (%) (optional)"
              value={targetShare}
              onChange={(e) => setTargetShare(e.target.value)}
            />

            {/* Optional custom prompt */}
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes or data source (e.g., Statista 2025 AI SaaS report)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Generating..." : "Generate TAM / SAM / SOM"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
