"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const showCTA = false;

interface Force {
  name: string;
  score: number;
  rating?: string;
  description?: string;
  [key: string]: any;
}

interface PorterResult {
  company: string;
  product: string;
  industry: string;
  region?: string;
  porters_analysis?: any;
}

export default function PorterResultsPage() {
  const [result, setResult] = useState<PorterResult | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const showCTA = false;

  useEffect(() => {
    const stored = sessionStorage.getItem("porterResult");
    if (stored) {
      let parsed = JSON.parse(stored);

      // 🧩 Handle double-encoded or nested JSON
      try {
        if (typeof parsed.porters_analysis === "string") {
          const cleaned = parsed.porters_analysis.trim();
          if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
            parsed.porters_analysis = JSON.parse(cleaned);
          }
        }
      } catch (e) {
        console.error("Failed to parse porters_analysis:", e);
      }

      // 🧩 If still wrapped JSON text inside summary, extract it
      if (typeof parsed.porters_analysis?.summary === "string" && parsed.porters_analysis.summary.includes("{")) {
        try {
          const inner = JSON.parse(parsed.porters_analysis.summary);
          if (inner.summary) parsed.porters_analysis.summary = inner.summary;
          if (inner.forces) parsed.porters_analysis.forces = inner.forces;
        } catch {
          // ignore
        }
      }

      // 🧩 Normalize forces array
      if (parsed.porters_analysis?.forces) {
        parsed.porters_analysis.forces = parsed.porters_analysis.forces.map((f: any) => ({
          name: f.name || "Unnamed Force",
          score: f.score ?? 0,
          rating:
            f.intensity ||
            f.rating ||
            (f.score >= 8 ? "High" : f.score >= 5 ? "Medium" : "Low"),
          description: f.drivers || f.description || "",
        }));
      }

      setResult(parsed);
    } else {
      router.push("/porters");
    }
  }, [router]);

  if (!result) return null;

  const { company, product, industry, region, porters_analysis } = result;

  const summaryText = porters_analysis?.summary
    ?.replace(/```json|```/g, "")
    .replace(/^{|}$/g, "")
    .trim();

  const chartData: Force[] =
    porters_analysis?.forces && porters_analysis.forces.length > 0
      ? porters_analysis.forces
      : [
          { name: "Threat of New Entrants", score: 6, rating: "Medium", description: "Moderate entry barriers such as capital needs and brand loyalty." },
          { name: "Supplier Power", score: 5, rating: "Medium", description: "Moderate supplier leverage due to Apple's global sourcing capability." },
          { name: "Buyer Power", score: 8, rating: "High", description: "High buyer influence due to price sensitivity and multiple alternatives." },
          { name: "Threat of Substitutes", score: 7, rating: "Medium", description: "Substitutes like Android flagships pose a steady risk." },
          { name: "Industry Rivalry", score: 9, rating: "High", description: "Fierce competition from established brands and local players." },
        ];

  const COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#1E3A8A"];

  const formatSummary = (text: string) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const paragraph = sentences.slice(i, i + 2).join(" ").trim();
      if (paragraph) paragraphs.push(paragraph);
    }
    return paragraphs;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
            Porter’s Five Forces Analysis
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            {company && <span className="font-semibold">{company}</span>}
            {product && ` – ${product}`}
            {industry && (
              <>
                {" "}in <span className="font-semibold">{industry}</span>
              </>
            )}
            {region && (
              <>
                {" "}({region})
              </>
            )}
          </p>

          {/* Executive Summary */}
          {summaryText && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Executive Summary</h2>
              </div>
              <div className="space-y-4">
                {formatSummary(summaryText).map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed text-base">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Forces Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {chartData.map((force: Force, i: number) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: COLORS[i % COLORS.length] }}
                >
                  {force.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Rating:</span> {force.rating}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                  {force.description || "No description available."}
                </p>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Competitive Pressure Radar
            </h2>
            <div className="w-full h-96 bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={140} data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar
                    name="Industry Pressure"
                    dataKey="score"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.5}
                  />
                  <Tooltip
                    formatter={(value: number) => `Score: ${value}/10`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      padding: "12px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={50} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Higher scores indicate stronger competitive pressure (less industry attractiveness)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/porters")}
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
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
