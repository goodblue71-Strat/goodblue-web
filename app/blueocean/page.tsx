"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateBlueOcean } from "../../lib/api";

export default function BlueOceanPage() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [customerSegment, setCustomerSegment] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [valueFocus, setValueFocus] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/blueocean" && pathname !== "/app/blueocean";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateBlueOcean({
        company,
        industry,
        customerSegment,
        blockers: alternatives || undefined,
        valueProposition: valueFocus || undefined,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "blueoceanResult",
        JSON.stringify({
          company,
          industry,
          customerSegment,
          alternatives,
          valueFocus,
          blue_ocean_canvas: data.blue_ocean_strategy,
        })
      );

      router.push("/blueocean/results");
    } catch (err) {
      console.error(err);
      alert("Error generating Blue Ocean canvas");
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
            Designing blue ocean moves...
          </p>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 transition-all">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-700">
            Blue Ocean Canvas Generator
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Re-think value curves, eliminate trade-offs, and create uncontested market space
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
                Industry or Space
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Productivity Software, Premium Fitness"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Customer / Job-to-be-done
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Growth teams needing faster insights"
                value={customerSegment}
                onChange={(e) => setCustomerSegment(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adoption Barriers or Pain Points (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., high switching costs, complex onboarding, limited integrations"
                value={alternatives}
                onChange={(e) => setAlternatives(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Value Proposition (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., fastest insights, simplest workflow"
                value={valueFocus}
                onChange={(e) => setValueFocus(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., emphasize factors to eliminate, reduce, raise, create"
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
              {loading ? "Analyzing..." : "Generate Blue Ocean Canvas"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
