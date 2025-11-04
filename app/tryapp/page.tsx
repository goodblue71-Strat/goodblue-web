"use client";

import { useState } from "react";
import { generateSWOT } from "../../lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function SWOTPage() {
  const [company, setCompany] = useState("");
  const [goal, setGoal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [swot, setSwot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const showCTA = pathname !== "/swot" && pathname !== "/app/swot";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSwot(null);
    try {
      const data = await generateSWOT({ company, goal, prompt });
      setSwot(data.swot_analysis);
    } catch (err) {
      console.error(err);
      alert("Error generating SWOT");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar (no CTA button inside SWOT app) */}
      <Navbar showCTA={showCTA} />

      {/* Centered Main Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            SWOT Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Goal (e.g. AI growth strategy)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional custom prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Generating..." : "Generate SWOT"}
            </button>
          </form>

          {swot && (
            <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-center text-gray-800">
                Result
              </h2>
              <pre className="whitespace-pre-wrap text-gray-700">{swot}</pre>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
