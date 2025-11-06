"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateCompetitiveAnalysis } from "../../lib/api";

export default function CompetitiveAnalysisPage() {
  const [company, setCompany] = useState("");
  const [market, setMarket] = useState("");
  const [product, setProduct] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [goal, setGoal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/comp" && pathname !== "/app/comp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateCompetitiveAnalysis({
        company,
        market,
        product,
        competitors: competitors || undefined,
        goal: goal || undefined,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "compResult",
        JSON.stringify({
          company,
          market,
          product,
          competitors,
          goal,
          competitive_analysis: data.competitive_analysis,
        })
      );

      router.push("/comp/results");
    } catch (err) {
      console.error(err);
      alert("Error generating competitive analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 relative">
      <Navbar showCTA={showCTA} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex space-x-2 mb-4">
            <span className="w-3 h-3 bg-blue-700 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
          <p className="text-blue-700 font-semibold text-lg">
            Generating competitive insights...
          </p>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 transition-all">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-700">
            Competitive Analysis Generator
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Understand rival positioning, differentiation, and strategic responses
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., GoodBlue"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market or Category
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AI SaaS, Energy Tech"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product or Offering
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Strategy Copilot"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Competitors (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Competitor A, Competitor B"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategic Goal (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., increase market share, differentiate pricing"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., highlight pricing battles or product roadmap gaps"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-800 disabled:bg-gray-400 transition-all"
            >
              {loading ? "Analyzing..." : "Generate Competitive Analysis"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
