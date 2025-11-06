"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Competitor = {
  name: string;
  share?: number;
  positioning?: string;
  strengths: string[];
  weaknesses: string[];
  moves: string[];
};

type Factor = {
  name: string;
  description?: string;
  weight?: number;
};

type FactorScore = {
  competitor: string;
  scores: { [factorName: string]: number };
};

interface CompetitiveAnalysisStored {
  company: string;
  market: string;
  product: string;
  competitors?: string;
  goal?: string;
  competitive_analysis?: any;
}

interface CompetitiveParsed {
  summary: string[];
  recommendation?: string;
  whitespace?: string;
  competitors: Competitor[];
  moves: string[];
  factors?: Factor[];
  factorScores?: FactorScore[];
}

const defaultCompetitors: Competitor[] = [
  {
    name: "Incumbent Alpha",
    share: 38,
    positioning: "Full-suite incumbent with enterprise reach",
    strengths: ["Deep integrations", "Brand trust", "Global services team"],
    weaknesses: ["Legacy UX", "Slow release cadence"],
    moves: ["Double down on enterprise renewals", "Bundle professional services"],
  },
  {
    name: "Challenger Beta",
    share: 27,
    positioning: "Product-led disruptor with aggressive pricing",
    strengths: ["Fast roadmap", "Modern collaboration"],
    weaknesses: ["Limited analytics", "Shallow partner ecosystem"],
    moves: ["Expand analyst partnerships", "Introduce mid-market success team"],
  },
  {
    name: "Niche Gamma",
    share: 12,
    positioning: "Vertical specialist winning regulated industries",
    strengths: ["Compliance expertise", "Industry templates"],
    weaknesses: ["High switching costs", "Small salesforce"],
    moves: ["Publish win stories", "Build partner marketplace"],
  },
];

const defaultSummary = [
  "Market leadership remains contested between a legacy full-suite provider and a fast-moving challenger, creating opportunities for differentiated plays.",
  "Switching costs and integrations are decisive barriers; buyers cite data portability and onboarding experience as top pain points.",
];

const defaultMoves = [
  "Launch an accelerated migration program focused on top two incumbent pain points.",
  "Publish transparent roadmap commitments to neutralize speed perception gaps.",
  "Co-market with complementary analytics vendors to expand perceived surface area.",
];

const tryParseJSON = (input: any) => {
  if (typeof input !== "string") return input ?? null;
  try {
    return JSON.parse(input.trim());
  } catch {
    return null;
  }
};

const cleanText = (text?: string) => (text || "").replace(/```json|```/g, "").trim();

const toParagraphs = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => cleanText(String(item))).filter(Boolean);
  if (typeof value === "string") {
    return cleanText(value)
      .split(/\n+|•|- |\*/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
};

const toCompetitors = (value: any): Competitor[] => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : typeof value === "object" ? Object.values(value) : [];

  return list
    .map((item: any) => {
      if (!item) return null;
      if (typeof item === "string") {
        return {
          name: item,
          strengths: [],
          weaknesses: [],
          moves: [],
        } as Competitor;
      }

      const strengths = toParagraphs(item.strengths ?? item.pros ?? item.advantages);
      const weaknesses = toParagraphs(item.weaknesses ?? item.cons ?? item.gaps);
      const moves = toParagraphs(item.recommended_actions ?? item.moves ?? item.plays);

      return {
        name: item.name ?? item.competitor ?? item.label ?? "Competitor",
        share:
          item.share != null
            ? Number(item.share)
            : item.market_share != null
            ? Number(item.market_share)
            : undefined,
        positioning: cleanText(item.positioning ?? item.summary ?? item.position),
        strengths,
        weaknesses,
        moves,
      } as Competitor;
    })
    .filter(Boolean) as Competitor[];
};

const toFactors = (value: any): Factor[] => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  
  return value.map((item: any) => ({
    name: item.name || "Factor",
    description: item.description || "",
    weight: item.weight || 0.2,
  }));
};

const toFactorScores = (value: any): FactorScore[] => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  
  return value.map((item: any) => ({
    competitor: item.competitor || "Unknown",
    scores: item.scores || {},
  }));
};

// Color palette for factors
const FACTOR_COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
];

export default function CompetitiveAnalysisResultsPage() {
  const [stored, setStored] = useState<CompetitiveAnalysisStored | null>(null);
  const [parsed, setParsed] = useState<CompetitiveParsed | null>(null);

  const router = useRouter();
  const showCTA = false;

  useEffect(() => {
    const raw = sessionStorage.getItem("compResult");
    if (!raw) {
      router.push("/comp");
      return;
    }

    const base: CompetitiveAnalysisStored = JSON.parse(raw);
    const analysis = base.competitive_analysis;
    let obj = tryParseJSON(analysis) ?? analysis;

    if (obj && typeof obj === "object" && typeof obj.summary === "string") {
      const inner = tryParseJSON(obj.summary);
      if (inner) {
        obj.summary = inner.summary ?? obj.summary;
        obj.recommendation = inner.recommendation ?? obj.recommendation;
        obj.competitors = inner.competitors ?? obj.competitors;
        obj.whitespace = inner.whitespace ?? obj.whitespace;
      }
    }

    const summary = toParagraphs(obj?.summary ?? obj?.executive_summary);
    const recommendation = cleanText(obj?.recommendation ?? obj?.takeaway ?? obj?.key_takeaway ?? "");
    const whitespace = cleanText(obj?.whitespace ?? obj?.opportunity ?? "");
    const competitors = toCompetitors(obj?.competitors ?? obj?.players ?? obj?.landscape ?? obj?.competitive_dynamics);
    const moves = toParagraphs(
      obj?.recommended_moves ?? obj?.playbook ?? obj?.actions ?? obj?.next_steps ?? obj?.recommended_actions
    );
    const factors = toFactors(obj?.factors);
    const factorScores = toFactorScores(obj?.factor_scores ?? obj?.factorScores);

    setStored(base);
    setParsed({
      summary: summary.length ? summary : defaultSummary,
      recommendation: recommendation || undefined,
      whitespace: whitespace || undefined,
      competitors: competitors.length ? competitors : defaultCompetitors,
      moves: moves.length ? moves : defaultMoves,
      factors: factors.length ? factors : undefined,
      factorScores: factorScores.length ? factorScores : undefined,
    });
  }, [router]);

  const totalShare = useMemo(() => {
    if (!parsed?.competitors?.length) return 0;
    return parsed.competitors.reduce((acc, c) => acc + (c.share ?? 0), 0);
  }, [parsed]);

  const maxScore = 10; // Scores are 0-10

  if (!stored || !parsed) return null;

  const { company, market, product, competitors: competitorInput, goal } = stored;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
            Competitive Analysis
          </h1>
          <p className="text-center text-gray-600 mb-2 text-lg">
            {company && <span className="font-semibold">{company}</span>}
            {product && ` – ${product}`}
          </p>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {market && `${market} Market`}
            {(goal || competitorInput) && (
              <span className="ml-2">
                {goal ? ` • ${goal}` : ""}
                {competitorInput ? ` • vs. ${competitorInput}` : ""}
              </span>
            )}
          </p>

          {parsed.summary.length > 0 && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Executive Summary</h2>
              </div>
              {parsed.summary.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Factor-Based Bar Chart */}
          {parsed.factors && parsed.factorScores && parsed.factorScores.length > 0 && (
            <div className="mb-10 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Competitive Factor Analysis</h2>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6">
                {parsed.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: FACTOR_COLORS[idx % FACTOR_COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="space-y-6">
                {parsed.factorScores.map((scoreData, idx) => {
                  const totalScore = Object.values(scoreData.scores).reduce((a, b) => a + b, 0);
                  const avgScore = totalScore / Object.values(scoreData.scores).length;
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-800">
                          {scoreData.competitor}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Avg: {avgScore.toFixed(1)}
                        </span>
                      </div>
                      
                      {/* Horizontal bars proportional to score */}
                      <div className="flex gap-0.5 w-full">
                        {parsed.factors?.map((factor, factorIdx) => {
                          const score = scoreData.scores[factor.name] || 0;
                          const percentage = (score / maxScore) * 100;
                          
                          return (
                            <div
                              key={factorIdx}
                              className="relative h-10 flex items-center justify-center text-white text-xs font-semibold transition-all hover:opacity-90"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: FACTOR_COLORS[factorIdx % FACTOR_COLORS.length],
                                minWidth: score > 0 ? '30px' : '0px',
                              }}
                              title={`${factor.name}: ${score.toFixed(1)}/10`}
                            >
                              {score > 0 && <span>{score.toFixed(1)}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Factor Descriptions */}
              {parsed.factors.some(f => f.description) && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Factor Definitions</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {parsed.factors.map((factor, idx) => (
                      factor.description && (
                        <div key={idx} className="flex gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: FACTOR_COLORS[idx % FACTOR_COLORS.length] }}
                          ></div>
                          <div>
                            <span className="font-medium text-gray-700">{factor.name}:</span>
                            <span className="text-sm text-gray-600 ml-1">{factor.description}</span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3 mb-10">
            {parsed.competitors.map((competitor, idx) => (
              <div
                key={idx}
                className="rounded-2xl border-2 border-gray-300 shadow-md bg-white p-6 flex flex-col gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-blue-800">
                      {competitor.name}
                    </h3>
                    {competitor.share != null && (
                      <span className="text-sm font-semibold text-blue-600">
                        {competitor.share}% share
                      </span>
                    )}
                  </div>
                  {competitor.positioning && (
                    <p className="text-sm text-gray-600 mt-1">
                      {competitor.positioning}
                    </p>
                  )}
                </div>

                {competitor.share != null && totalShare > 0 && (
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min(100, (competitor.share / totalShare) * 100)}%` }}
                    ></div>
                  </div>
                )}

                {competitor.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Strengths
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {competitor.strengths.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competitor.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Vulnerabilities
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {competitor.weaknesses.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competitor.moves.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Likely Moves
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {competitor.moves.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(parsed.recommendation || parsed.whitespace) && (
            <div className="mb-10">
              {parsed.recommendation && (
                <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    Recommended Strategic Response
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{parsed.recommendation}</p>
                </div>
              )}

              {parsed.whitespace && (
                <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">
                    Whitespace Opportunity
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{parsed.whitespace}</p>
                </div>
              )}
            </div>
          )}

          {parsed.moves.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Offensive Playbook</h2>
              <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  {parsed.moves.map((move, i) => (
                    <li key={i}>{move}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
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
