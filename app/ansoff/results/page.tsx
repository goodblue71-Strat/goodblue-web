"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateAnsoff } from "../../lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

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
        prompt: prompt || undefined 
      });
      
      // Store the result and navigate to results page
      sessionStorage.setItem("ansoffResult", JSON.stringify({
        company,
        product,
        market,
        goal,
        ansoff_analysis: data.ansoff_analysis
      }));
      
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
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
            Ansoff Matrix Generator
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Target market (e.g., SMBs in North America)"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Goal (e.g., expansion strategy)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Optional custom prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
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
