"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AnsoffResult {
  company: string;
  product: string;
  market: string;
  goal: string;
  ansoff_analysis: string;
}

interface ParsedAnsoff {
  marketPenetration: string[];
  marketDevelopment: string[];
  productDevelopment: string[];
  diversification: string[];
}

export default function AnsoffResultsPage() {
  const [result, setResult] = useState<AnsoffResult | null>(null);
  const [parsedAnsoff, setParsedAnsoff] = useState<ParsedAnsoff | null>(null);
  const router = useRouter();

  // --- Parsing logic (unchanged) ---
  const parseAnsoffAnalysis = (analysis: string): ParsedAnsoff => {
    const parsed: ParsedAnsoff = {
      marketPenetration: [],
      marketDevelopment: [],
      productDevelopment: [],
      diversification: [],
    };

    const extract = (section: string) =>
      analysis.match(
        new RegExp(
          `(?:\\*\\*)?${section}(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=(?:\\*\\*)?(?:Market Penetration|Market Development|Product Development|Diversification)(?:\\*\\*)?:|$)`,
          "i"
        )
      );

    const bullets = (text: string) =>
      text
        ?.split("\n")
        .map((l) => l.trim())
        .filter((l) => l)
        .map((l) => l.replace(/^[-*•]\s*/, ""))
        .filter(Boolean) || [];

    parsed.marketPenetration = bullets(extract("Market Penetration")?.[1] || "");
    parsed.marketDevelopment = bullets(extract("Market Development")?.[1] || "");
    parsed.productDevelopment = bullets(extract("Product Development")?.[1] || "");
    parsed.diversification = bullets(extract("Diversification")?.[1] || "");

    return parsed;
  };

  const renderBullet = (text: string) => {
    const subtitleMatch = text.match(/^\*\*([^*]+)\*\*:?\s*/);
    if (subtitleMatch) {
      const subtitle = subtitleMatch[1];
      const content = text.substring(subtitleMatch[0].length).trim();
      return (
        <div className="mb-3">
          <div className="flex items-start">
            <span className="mr-2 text-blue-700 font-bold">•</span>
            <div>
              <strong className="text-gray-900">{subtitle}:</strong>{" "}
              <span className="text-gray-700">{content}</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mb-3 flex items-start">
        <span className="mr-2 text-blue-700 font-bold">•</span>
        <span className="text-gray-700">{text}</span>
      </div>
    );
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("ansoffResult");
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);
      setParsedAnsoff(parseAnsoffAnalysis(data.ansoff_analysis));
    } else {
      router.push("/ansoff");
    }
  }, [router]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("ansoffResult");
    router.push("/ansoff");
  };

  if (!result || !parsedAnsoff)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar showCTA={false} />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
        <Footer />
      </div>
    );

  // --- Color themes for each quadrant ---
  const quadrantStyles = {
    penetration: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
    development: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900",
    product: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-900",
    diversification: "from-rose-50 to-rose-100 border-rose-200 text-rose-900",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={false} />

      <main className="flex-grow px-4 py-12">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
            Ansoff Matrix Results
          </h1>
          <p className="text-center text-gray-500 mb-10 text-lg">
            Strategic growth options for{" "}
            <span className="font-semibold text-blue-700">{result.company}</span>’s{" "}
            <span className="font-semibold text-blue-700">{result.product}</span> in{" "}
            <span className="font-semibold text-blue-700">{result.market}</span> targeting{" "}
            {result.goal}.
          </p>

          {/* Info Card */}
          <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Analysis Summary</h2>
            <ul className="text-gray-700 space-y-1">
              <li>
                <strong>Company:</strong> {result.company}
              </li>
              <li>
                <strong>Product:</strong> {result.product}
              </li>
              <li>
                <strong>Market:</strong> {result.market}
              </li>
              <li>
                <strong>Goal:</strong> {result.goal}
              </li>
            </ul>
          </div>

          {/* Ansoff Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Market Penetration */}
            <div
              className={`bg-gradient-to-br ${quadrantStyles.penetration} border-2 rounded-xl p-6 shadow-sm`}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center text-blue-800">
                📊 Market Penetration
              </h3>
              <p className="text-sm text-gray-600 mb-4 italic">
                Existing Products × Existing Markets
              </p>
              {parsedAnsoff.marketPenetration.length > 0 ? (
                parsedAnsoff.marketPenetration.map((t, i) => (
                  <div key={i}>{renderBullet(t)}</div>
                ))
              ) : (
                <p className="text-gray-500 italic">No strategies identified.</p>
              )}
            </div>

            {/* Market Development */}
            <div
              className={`bg-gradient-to-br ${quadrantStyles.development} border-2 rounded-xl p-6 shadow-sm`}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center text-indigo-800">
                🌍 Market Development
              </h3>
              <p className="text-sm text-gray-600 mb-4 italic">
                Existing Products × New Markets
              </p>
              {parsedAnsoff.marketDevelopment.length > 0 ? (
                parsedAnsoff.marketDevelopment.map((t, i) => (
                  <div key={i}>{renderBullet(t)}</div>
                ))
              ) : (
                <p className="text-gray-500 italic">No strategies identified.</p>
              )}
            </div>

            {/* Product Development */}
            <div
              className={`bg-gradient-to-br ${quadrantStyles.product} border-2 rounded-xl p-6 shadow-sm`}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center text-cyan-800">
                🚀 Product Development
              </h3>
              <p className="text-sm text-gray-600 mb-4 italic">
                New Products × Existing Markets
              </p>
              {parsedAnsoff.productDevelopment.length > 0 ? (
                parsedAnsoff.productDevelopment.map((t, i) => (
                  <div key={i}>{renderBullet(t)}</div>
                ))
              ) : (
                <p className="text-gray-500 italic">No strategies identified.</p>
              )}
            </div>

            {/* Diversification */}
            <div
              className={`bg-gradient-to-br ${quadrantStyles.diversification} border-2 rounded-xl p-6 shadow-sm`}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center text-rose-800">
                🎯 Diversification
              </h3>
              <p className="text-sm text-gray-600 mb-4 italic">
                New Products × New Markets
              </p>
              {parsedAnsoff.diversification.length > 0 ? (
                parsedAnsoff.diversification.map((t, i) => (
                  <div key={i}>{renderBullet(t)}</div>
                ))
              ) : (
                <p className="text-gray-500 italic">No strategies identified.</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleNewAnalysis}
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
