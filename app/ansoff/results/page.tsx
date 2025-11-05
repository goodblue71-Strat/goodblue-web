"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AnsoffMatrix {
  marketPenetration: string[];
  marketDevelopment: string[];
  productDevelopment: string[];
  diversification: string[];
}

interface AnsoffResult {
  company: string;
  product: string;
  market: string;
  goal: string;
  ansoff_analysis: {
    summary?: string;
    matrix?: AnsoffMatrix;
    recommendation?: string;
  };
}

export default function AnsoffResultsPage() {
  const [result, setResult] = useState<AnsoffResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("ansoffResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/ansoff");
    }
  }, [router]);

  if (!result) return null;

  const { company, product, market, goal, ansoff_analysis } = result;
  const matrix = ansoff_analysis.matrix || {};
  const summary = ansoff_analysis.summary || "";
  const recommendation = ansoff_analysis.recommendation || "";

  const quadrants = [
    { title: "📊 Market Penetration", key: "marketPenetration", color: "from-blue-50 to-blue-100 border-blue-200 text-blue-900", desc: "Existing Products × Existing Markets" },
    { title: "🌍 Market Development", key: "marketDevelopment", color: "from-teal-50 to-sky-100 border-sky-200 text-sky-900", desc: "Existing Products × New Markets" },
    { title: "🚀 Product Development", key: "productDevelopment", color: "from-gray-50 to-blue-50 border-gray-200 text-gray-800", desc: "New Products × Existing Markets" },
    { title: "🎯 Diversification", key: "diversification", color: "from-cyan-50 to-slate-100 border-cyan-200 text-slate-900", desc: "New Products × New Markets" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={false} />

      <main className="flex-grow px-4 py-12">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
            Ansoff Matrix Results
          </h1>

          <p className="text-center text-gray-500 mb-10 text-lg">
            Growth insights for <strong className="text-blue-700">{company}</strong>’s{" "}
            <strong className="text-blue-700">{product}</strong> in{" "}
            <strong className="text-blue-700">{market}</strong>, aiming for{" "}
            <strong className="text-blue-700">{goal}</strong>.
          </p>

          {/* Summary */}
          {summary && (
            <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Key Takeaway</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {summary}
              </p>
            </div>
          )}

          {/* Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {quadrants.map((q, i) => {
              const items = (matrix as any)[q.key] || [];
              return (
                <div key={i} className={`bg-gradient-to-br ${q.color} border-2 rounded-xl p-6 shadow-sm`}>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 italic">{q.desc}</p>
                  {items.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {items.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No strategies provided.</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recommended Path */}
          {recommendation && (
            <div className="mb-10 p-8 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-sky-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-sky-900">💡 Recommended Growth Path</h2>
              </div>
              <p className="ext-gray-700 text-base leading-relaxed">{recommendation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                sessionStorage.removeItem("ansoffResult");
                router.push("/ansoff");
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              🔁 New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
