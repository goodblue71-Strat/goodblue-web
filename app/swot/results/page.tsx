"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SWOTResult {
  company: string;
  product: string;
  goal: string;
  feature?: string;
  swot_analysis: string;
}

interface ParsedSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  summary?: string;
  recommendation?: string;
}

export default function SWOTResultsPage() {
  const [result, setResult] = useState<SWOTResult | null>(null);
  const [parsedSWOT, setParsedSWOT] = useState<ParsedSWOT | null>(null);
  const router = useRouter();

  // --- Parsing logic ---
  const parseSWOTAnalysis = (analysis: string): ParsedSWOT => {
    const parsed: ParsedSWOT = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      summary: "",
      recommendation: "",
    };

    // Try to extract summary/recommendation if JSON-like
    try {
      const json = JSON.parse(analysis);
      if (json.summary || json.recommendation || json.strengths) return json;
    } catch {
      // continue with text parsing
    }

    const extract = (section: string) =>
      analysis.match(
        new RegExp(
          `(?:\\*\\*)?${section}(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=(?:\\*\\*)?(?:Strengths?|Weaknesses?|Opportunities?|Threats?|Key Takeaway|Recommendation)(?:\\*\\*)?:|$)`,
          "i"
        )
      );

    const extractBullets = (text: string): string[] => {
      if (!text) return [];
      return text
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)
        )
        .map((line) =>
          line.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, "").trim()
        )
        .filter((line) => line.length > 0);
    };

    const summaryMatch = analysis.match(/(?:\*\*)?(?:Summary|Key Takeaway)(?:\*\*)?:?\s*([\s\S]*?)(?=\*\*|Strengths?|Weaknesses?|Opportunities?|Threats?|$)/i);
    const recMatch = analysis.match(/(?:\*\*)?(?:Recommendation|Action Plan)(?:\*\*)?:?\s*([\s\S]*)/i);

    parsed.summary = summaryMatch?.[1]?.trim() || "";
    parsed.recommendation = recMatch?.[1]?.trim() || "";

    const strengths = extract("Strengths");
    const weaknesses = extract("Weaknesses");
    const opportunities = extract("Opportunities");
    const threats = extract("Threats");

    if (strengths?.[1]) parsed.strengths = extractBullets(strengths[1]);
    if (weaknesses?.[1]) parsed.weaknesses = extractBullets(weaknesses[1]);
    if (opportunities?.[1]) parsed.opportunities = extractBullets(opportunities[1]);
    if (threats?.[1]) parsed.threats = extractBullets(threats[1]);

    return parsed;
  };

  // --- Bold text renderer ---
  const renderBulletWithBold = (text: string) => {
    const regex = /\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    return parts;
  };

  // --- Load data ---
  useEffect(() => {
    const stored = sessionStorage.getItem("swotResult");
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);
      setParsedSWOT(parseSWOTAnalysis(data.swot_analysis));
    } else {
      router.push("/swot");
    }
  }, [router]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("swotResult");
    router.push("/swot");
  };

  if (!result || !parsedSWOT) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <Navbar showCTA={false} />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = [
    {
      title: "💪 Strengths",
      color: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
      data: parsedSWOT.strengths,
    },
    {
      title: "⚖️ Weaknesses",
      color: "from-slate-50 to-gray-100 border-gray-200 text-gray-800",
      iconColor: "text-gray-500",
      data: parsedSWOT.weaknesses,
    },
    {
      title: "🎯 Opportunities",
      color: "from-cyan-50 to-sky-100 border-sky-200 text-sky-900",
      iconColor: "text-sky-600",
      data: parsedSWOT.opportunities,
    },
    {
      title: "⚡ Threats",
      color: "from-teal-50 to-slate-100 border-teal-200 text-slate-900",
      iconColor: "text-teal-600",
      data: parsedSWOT.threats,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={false} />

      <main className="flex-grow px-4 py-12">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
            SWOT Analysis Results
          </h1>

          <p className="text-center text-gray-500 mb-10 text-lg">
            Strategic insights for{" "}
            <strong className="text-blue-700">{result.company}</strong>’s{" "}
            <strong className="text-blue-700">{result.product}</strong> focused on{" "}
            <strong className="text-blue-700">{result.goal}</strong>.
          </p>

          {/* 🔹 Top Key Takeaway */}
          {parsedSWOT.summary && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Key Takeaway</h2>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                {parsedSWOT.summary}
              </p>
            </div>
          )}

          {/* Overview */}
          <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-blue-900">Overview</h2>
            </div>
            <div className="text-gray-700 space-y-1 leading-relaxed">
              <p>
                <strong>Company:</strong> {result.company}
              </p>
              <p>
                <strong>Product:</strong> {result.product}
              </p>
              {result.feature && (
                <p>
                  <strong>Feature:</strong> {result.feature}
                </p>
              )}
              <p>
                <strong>Goal:</strong> {result.goal}
              </p>
            </div>
          </div>

          {/* SWOT Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {sections.map((s, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${s.color} border-2 rounded-xl p-6 shadow-sm`}
              >
                <h3 className={`text-2xl font-bold mb-3 flex items-center ${s.iconColor}`}>
                  {s.title}
                </h3>
                {s.data.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {s.data.map((item, i) => (
                      <li key={i}>{renderBulletWithBold(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No points provided.</p>
                )}
              </div>
            ))}
          </div>

          {/* 🔹 Bottom Recommendation */}
          {parsedSWOT.recommendation && (
            <div className="mb-10 p-8 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-sky-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-sky-900">
                  Strategic Recommendation
                </h2>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                {parsedSWOT.recommendation}
              </p>
            </div>
          )}

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
