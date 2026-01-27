"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Types for the new deck schema
interface DeckMeta {
  company: string;
  product: string;
  market: string;
  competitors: string[];
  goal: string;
}

interface ExecutiveSummary {
  Title: string;
  KeyInsights: string[];
  StrategicTakeaway: string;
}

interface PlotPoint {
  name: string;
  x: number;
  y: number;
  category: string;
  notes: string;
}

interface MarketLandscape {
  Title: string;
  Axes: {
    XAxis: string;
    YAxis: string;
  };
  Quadrants: {
    Leaders: string[];
    Challengers: string[];
    Emerging: string[];
    Niche: string[];
  };
  PlotPoints: PlotPoint[];
  Observations: string[];
}

interface HeadToHeadRow {
  Capability: string;
  Values: { [company: string]: string };
}

interface HeadToHead {
  Title: string;
  Table: {
    Columns: string[];
    Rows: HeadToHeadRow[];
  };
  Takeaway: string;
}

interface CompetitorDeepDive {
  Title: string;
  Company: string;
  Positioning: string;
  Strengths: string[];
  Weaknesses: string[];
  SWOT: {
    Strengths: string[];
    Weaknesses: string[];
    Opportunities: string[];
    Threats: string[];
  };
  StrategicImplication: string;
}

interface WhiteSpace {
  Title: string;
  WhatExistsToday: string[];
  WhatLeadersNeed: string[];
  WhiteSpaceOpportunity: string;
  BottomLine: string;
}

interface NextSteps {
  Title: string;
  Immediate_0_90_Days: string[];
  MidTerm: string[];
  Avoid: string[];
  ExecutionNote: string;
}

interface Sources {
  Title: string;
  Sources: {
    UploadedFiles: string[];
    PublicWebsites: string[];
    ProductDocs: string[];
    PricingPages: string[];
    AnalystSources: string[];
  };
  Method: string[];
  Disclaimer: string;
}

interface DeckAnalysis {
  schema_version: string;
  meta: DeckMeta;
  Slide2_ExecutiveSummary: ExecutiveSummary;
  Slide3_MarketLandscape: MarketLandscape;
  Slide4_HeadToHead: HeadToHead;
  Slide5_Competitor_DeepDive_SWOT: CompetitorDeepDive;
  Slide6_StrategicWhiteSpace: WhiteSpace;
  Slide7_NextSteps: NextSteps;
  Slide8_Sources_Methodology: Sources;
}

interface StoredResult {
  company: string;
  market: string;
  product: string;
  competitors?: string;
  goal?: string;
  competitive_analysis?: DeckAnalysis;
}

// Quadrant colors
const QUADRANT_COLORS: { [key: string]: string } = {
  Leaders: "#22c55e",
  Challengers: "#3b82f6",
  Emerging: "#f59e0b",
  Niche: "#8b5cf6",
};

export default function CompetitiveAnalysisResultsPage() {
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("compResult");
    if (!raw) {
      router.push("/comp");
      return;
    }

    try {
      const base: StoredResult = JSON.parse(raw);
      setStored(base);

      if (base.competitive_analysis) {
        setAnalysis(base.competitive_analysis);
      }
    } catch (e) {
      console.error("Failed to parse results:", e);
      router.push("/comp");
    }
  }, [router]);

  if (!stored || !analysis) return null;

  const { meta } = analysis;
  const exec = analysis.Slide2_ExecutiveSummary;
  const landscape = analysis.Slide3_MarketLandscape;
  const headToHead = analysis.Slide4_HeadToHead;
  const deepDive = analysis.Slide5_Competitor_DeepDive_SWOT;
  const whiteSpace = analysis.Slide6_StrategicWhiteSpace;
  const nextSteps = analysis.Slide7_NextSteps;
  const sources = analysis.Slide8_Sources_Methodology;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800">
      <Navbar showCTA={false} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
            <h1 className="text-4xl font-bold text-blue-700 mb-2">
              Competitive Analysis
            </h1>
            <p className="text-xl text-gray-700">
              <span className="font-semibold">{meta?.company || stored.company}</span>
              {(meta?.product || stored.product) && ` – ${meta?.product || stored.product}`}
            </p>
            <p className="text-gray-500 mt-1">
              {(meta?.market || stored.market) && `${meta?.market || stored.market} Market`}
              {meta?.goal && ` • ${meta.goal}`}
            </p>
          </div>

          {/* Slide 2: Executive Summary */}
          {exec && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                {exec.Title || "Executive Summary"}
              </h2>
              <div className="space-y-3 mb-6">
                {exec.KeyInsights?.filter(Boolean).map((insight, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
              {exec.StrategicTakeaway && (
                <div className="mt-6 p-4 bg-blue-600 text-white rounded-xl">
                  <p className="font-semibold">Strategic Takeaway:</p>
                  <p>{exec.StrategicTakeaway}</p>
                </div>
              )}
            </div>
          )}

          {/* Slide 3: Market Landscape */}
          {landscape && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {landscape.Title || "Market Landscape & Positioning"}
              </h2>

              {/* Quadrant Chart */}
              <div className="relative w-full aspect-square max-w-2xl mx-auto mb-8 border-2 border-gray-300 rounded-xl overflow-hidden">
                {/* Axis Labels */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
                  {landscape.Axes?.XAxis || "X Axis"} →
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                  {landscape.Axes?.YAxis || "Y Axis"} →
                </div>

                {/* Quadrant Backgrounds */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="bg-green-50 border-r border-b border-gray-200 flex items-center justify-center">
                    <span className="text-green-700 font-semibold opacity-50">Leaders</span>
                  </div>
                  <div className="bg-blue-50 border-b border-gray-200 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold opacity-50">Challengers</span>
                  </div>
                  <div className="bg-purple-50 border-r border-gray-200 flex items-center justify-center">
                    <span className="text-purple-700 font-semibold opacity-50">Niche</span>
                  </div>
                  <div className="bg-amber-50 flex items-center justify-center">
                    <span className="text-amber-700 font-semibold opacity-50">Emerging</span>
                  </div>
                </div>

                {/* Plot Points */}
                {landscape.PlotPoints?.map((point, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${(point.x / 10) * 100}%`,
                      bottom: `${(point.y / 10) * 100}%`,
                      backgroundColor: QUADRANT_COLORS[point.category] || "#6b7280",
                    }}
                    title={`${point.name}: ${point.notes}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {point.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {landscape.PlotPoints?.map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: QUADRANT_COLORS[point.category] || "#6b7280" }}
                    ></div>
                    <span className="text-sm text-gray-700">{point.name}</span>
                  </div>
                ))}
              </div>

              {/* Observations */}
              {landscape.Observations?.filter(Boolean).length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Key Observations</h3>
                  <ul className="space-y-2">
                    {landscape.Observations.filter(Boolean).map((obs, i) => (
                      <li key={i} className="flex gap-2 text-gray-700">
                        <span className="text-blue-500">•</span>
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Slide 4: Head-to-Head Comparison */}
          {headToHead && headToHead.Table?.Rows?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {headToHead.Title || "Head-to-Head Comparison"}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      {headToHead.Table.Columns?.map((col, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left font-semibold text-blue-900 border-b-2 border-blue-200"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {headToHead.Table.Rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-gray-800 border-b border-gray-200">
                          {row.Capability}
                        </td>
                        {headToHead.Table.Columns?.slice(1).map((col, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700 border-b border-gray-200">
                            {row.Values?.[col] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {headToHead.Takeaway && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-900 font-medium">{headToHead.Takeaway}</p>
                </div>
              )}
            </div>
          )}

          {/* Slide 5: Competitor Deep Dive */}
          {deepDive && deepDive.Company && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {deepDive.Title || "Competitor Deep Dive"}
              </h2>
              <p className="text-lg text-blue-700 font-semibold mb-6">{deepDive.Company}</p>

              {deepDive.Positioning && (
                <p className="text-gray-600 mb-6 italic">{deepDive.Positioning}</p>
              )}

              {/* SWOT Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {deepDive.SWOT?.Strengths?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-500">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">Weaknesses</h3>
                  <ul className="space-y-1">
                    {deepDive.SWOT?.Weaknesses?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-red-500">−</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Opportunities</h3>
                  <ul className="space-y-1">
                    {deepDive.SWOT?.Opportunities?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-blue-500">↑</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">Threats</h3>
                  <ul className="space-y-1">
                    {deepDive.SWOT?.Threats?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-amber-500">!</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {deepDive.StrategicImplication && (
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="font-medium text-gray-800">Strategic Implication:</p>
                  <p className="text-gray-700">{deepDive.StrategicImplication}</p>
                </div>
              )}
            </div>
          )}

          {/* Slide 6: Strategic White Space */}
          {whiteSpace && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">
                {whiteSpace.Title || "Strategic White Space"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-white rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">What Exists Today</h3>
                  <ul className="space-y-2">
                    {whiteSpace.WhatExistsToday?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-gray-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">What Leaders Need</h3>
                  <ul className="space-y-2">
                    {whiteSpace.WhatLeadersNeed?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-purple-500">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {whiteSpace.WhiteSpaceOpportunity && (
                <div className="p-4 bg-purple-600 text-white rounded-xl mb-4">
                  <p className="font-semibold">White Space Opportunity:</p>
                  <p>{whiteSpace.WhiteSpaceOpportunity}</p>
                </div>
              )}

              {whiteSpace.BottomLine && (
                <p className="text-purple-900 font-medium">{whiteSpace.BottomLine}</p>
              )}
            </div>
          )}

          {/* Slide 7: Next Steps */}
          {nextSteps && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {nextSteps.Title || "Next Steps"}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">Immediate (0-90 Days)</h3>
                  <ul className="space-y-2">
                    {nextSteps.Immediate_0_90_Days?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-500 font-bold">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3">Mid-Term</h3>
                  <ul className="space-y-2">
                    {nextSteps.MidTerm?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-blue-500 font-bold">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Avoid</h3>
                  <ul className="space-y-2">
                    {nextSteps.Avoid?.filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-red-500">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {nextSteps.ExecutionNote && (
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="text-gray-700">{nextSteps.ExecutionNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Slide 8: Sources */}
          {sources && (
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {sources.Title || "Sources & Methodology"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {sources.Sources?.UploadedFiles?.filter(Boolean).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Uploaded Documents</h3>
                    <ul className="space-y-1">
                      {sources.Sources.UploadedFiles.filter(Boolean).map((file, i) => (
                        <li key={i} className="text-sm text-gray-600">📄 {file}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {sources.Sources?.PublicWebsites?.filter(Boolean).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Public Sources</h3>
                    <ul className="space-y-1">
                      {sources.Sources.PublicWebsites.filter(Boolean).map((url, i) => (
                        <li key={i} className="text-sm text-blue-600 truncate">🔗 {url}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {sources.Method?.filter(Boolean).length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Methodology</h3>
                  <ul className="space-y-1">
                    {sources.Method.filter(Boolean).map((m, i) => (
                      <li key={i} className="text-sm text-gray-600">• {m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sources.Disclaimer && (
                <p className="text-xs text-gray-500 italic mt-4">{sources.Disclaimer}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center py-8">
            <button
              onClick={() => router.push("/comp")}
              className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all"
            >
              New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 rounded-full bg-gray-600 text-white font-semibold shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
