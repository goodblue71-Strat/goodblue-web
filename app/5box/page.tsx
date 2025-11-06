"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateFiveBox } from "../../lib/api";

export default function FiveBoxPage() {
  const [customer, setCustomer] = useState("");
  const [need, setNeed] = useState("");
  const [solution, setSolution] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [outcome, setOutcome] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/5box" && pathname !== "/app/5box";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateFiveBox({
        customer,
        need,
        solution,
        advantage: advantage || undefined,
        outcome: outcome || undefined,
        prompt: prompt || undefined,
      });

      sessionStorage.setItem(
        "fiveBoxResult",
        JSON.stringify({
          customer,
          need,
          solution,
          advantage,
          outcome,
          five_box_strategy: data.five_box_strategy,
        })
      );

      router.push("/5box/results");
    } catch (err) {
      console.error(err);
      alert("Error generating 5-box strategy grid");
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
            Mapping strategy grid...
          </p>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 transition-all">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-700">
            5-Box Strategy Grid
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Clarify who you serve, the problem, your approach, proof, and outcomes
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Who is the primary customer?
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Product marketers inside mid-market SaaS"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What urgent need or problem do they face?
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Need board-ready narratives without spending weeks"
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How do we solve it?
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AI co-pilot that builds strategy artifacts in minutes"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What unfair advantage or proof do we have? (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Proprietary benchmark library, ex-consultant advisors"
                value={advantage}
                onChange={(e) => setAdvantage(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desired outcome or north star metric (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Board alignment in one week, 50% faster launch decisions"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Emphasize crisp messaging and executive-ready sequencing"
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
              {loading ? "Analyzing..." : "Generate 5-Box Strategy Grid"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
