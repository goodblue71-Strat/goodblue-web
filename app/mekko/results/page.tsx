"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";

type Subsegment = {
  name: string;
  share: number;         // % within segment (0-100)
  growth?: number;       // % CAGR
};

type Segment = {
  name: string;
  market_size: number;   // e.g., $B
  growth_rate?: number;  // % CAGR (segment-level, optional)
  subsegments?: Subsegment[];
};

interface MekkoResultStored {
  market: string;
  product: string;
  focus?: string;
  region?: string;
  mekko_analysis?: any;  // JSON or string
}

interface MekkoParsed {
  summary?: string;
  segments: Segment[];
}

export default function MekkoResultsPage() {
  const [res, setRes] = useState<MekkoResultStored | null>(null);
  const [parsed, setParsed] = useState<MekkoParsed | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/mekko" && pathname !== "/app/mekko";

  // ---------- Helpers ----------
  const tryParseJSON = (input: any): any | null => {
    if (typeof input !== "string") return input ?? null;
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  };

  const cleanSummary = (text?: string) =>
    (text || "")
      .replace(/```json|```/g, "")
      .trim();

  // Color by growth % (CAGR)
  const growthColor = (g?: number) => {
    if (g == null) return "#93C5FD"; // default pale blue
    if (g >= 30) return "#0ea5e9";   // sky-500 (fastest)
    if (g >= 20) return "#38bdf8";   // sky-400
    if (g >= 10) return "#60a5fa";   // blue-400
    if (g >= 5)  return "#93c5fd";   // blue-300
    return "#cbd5e1";                // slate-300 (slow)
  };

  // ---------- Load & normalize ----------
  useEffect(() => {
    const stored = sessionStorage.getItem("mekkoResult");
    if (!stored) {
      router.push("/mekko");
      return;
    }

    let result: MekkoResultStored = JSON.parse(stored);
    let analysis = result.mekko_analysis;

    // 1) If string, try parse
    let obj = tryParseJSON(analysis) ?? analysis;

    // 2) Sometimes summary itself is a JSON blob as string
    if (obj && typeof obj === "object" && typeof obj.summary === "string") {
      const inner = tryParseJSON(obj.summary);
      if (inner && typeof inner === "object") {
        // Merge any inner fields back
        obj.summary = inner.summary ?? obj.summary;
        if (inner.segments && Array.isArray(inner.segments)) {
          obj.segments = inner.segments;
        }
      }
    }

    // 3) Construct parsed structure
    let segments: Segment[] = [];
    let summary: string | undefined;

    if (obj && typeof obj === "object") {
      const segs = Array.isArray(obj.segments) ? obj.segments : [];
      segments = segs
        .map((s: any) => ({
          name: s.name ?? "Segment",
          market_size: Number(s.market_size ?? s.size ?? 0),
          growth_rate: s.growth_rate != null ? Number(s.growth_rate) : undefined,
          subsegments: Array.isArray(s.subsegments)
            ? s.subsegments.map((ss: any) => ({
                name: ss.name ?? "Subsegment",
                share: Number(ss.share ?? 0),
                growth: ss.growth != null ? Number(ss.growth) : undefined,
              }))
            : undefined,
        }))
        .filter((s: Segment) => s.market_size > 0);
      summary = cleanSummary(obj.summary);
    } else if (typeof obj === "string") {
      // Plain text fallback
      summary = cleanSummary(obj);
      // No segments; we'll show a placeholder
      segments = [];
    }

    // Fallback placeholder if no segments present
    if (segments.length === 0) {
      segments = [
        {
          name: "Segment A",
          market_size: 40,
          growth_rate: 15,
          subsegments: [
            { name: "Sub A1", share: 50, growth: 12 },
            { name: "Sub A2", share: 30, growth: 18 },
            { name: "Sub A3", share: 20, growth: 8 },
          ],
        },
        {
          name: "Segment B",
          market_size: 35,
          growth_rate: 22,
          subsegments: [
            { name: "Sub B1", share: 60, growth: 25 },
            { name: "Sub B2", share: 40, growth: 18 },
          ],
        },
        {
          name: "Segment C",
          market_size: 25,
          growth_rate: 8,
          subsegments: [
            { name: "Sub C1", share: 70, growth: 6 },
            { name: "Sub C2", share: 30, growth: 10 },
          ],
        },
      ];
      if (!summary) {
        summary =
          "Illustrative market structure: Segment A is largest with mid-teens growth, Segment B shows faster growth from a smaller base, and Segment C is smaller and maturing.";
      }
    }

    setRes(result);
    setParsed({ summary, segments });
  }, [router]);

  // ---------- Derived values ----------
  const totalSize = useMemo(() => {
    if (!parsed?.segments?.length) return 0;
    return parsed.segments.reduce((acc, s) => acc + (s.market_size || 0), 0);
  }, [parsed]);

  // Normalize subsegment shares to sum 100 if they don’t already
  const normalizedSegments = useMemo(() => {
    if (!parsed?.segments) return [];
    return parsed.segments.map((s) => {
      const subs = s.subsegments ?? [];
      const sum = subs.reduce((acc, ss) => acc + (ss.share || 0), 0);
      const adjusted =
        sum > 0
          ? subs.map((ss) => ({ ...ss, share: (ss.share * 100) / sum }))
          : [{ name: "All", share: 100, growth: s.growth_rate }];

      return { ...s, subsegments: adjusted };
    });
  }, [parsed]);

  if (!res || !parsed) return null;

  const { market, product, focus, region } = res;

  const formatSummary = (text: string) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const paragraph = sentences.slice(i, i + 2).join(" ").trim();
      if (paragraph) paragraphs.push(paragraph);
    }
    return paragraphs;
  };

  // ---------- Rendering ----------
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-cyan-700 mb-2">
            Market Structure (Mekko)
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            {market && (
              <>
                <span className="font-semibold">{market}</span>
                {product && ` – ${product}`}
              </>
            )}
            {(!market && product) && <span className="font-semibold">{product}</span>}
            {(region || focus) && (
              <>
                {" "}
                <span className="text-sm text-gray-500">
                  {region ? region : ""} {region && focus ? "•" : ""} {focus ? focus : ""}
                </span>
              </>
            )}
          </p>

          {/* Executive Summary */}
          {parsed.summary && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Executive Summary</h2>
              </div>
              <div className="space-y-4">
                {formatSummary(parsed.summary).map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed text-base">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Mekko Visualization */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">Market Map</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 mr-1 rounded" style={{ background: "#cbd5e1" }}></span>
                  <span className="text-gray-600">Low growth</span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 mr-1 rounded" style={{ background: "#93c5fd" }}></span>
                  <span className="text-gray-600">5–10%</span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 mr-1 rounded" style={{ background: "#60a5fa" }}></span>
                  <span className="text-gray-600">10–20%</span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 mr-1 rounded" style={{ background: "#38bdf8" }}></span>
                  <span className="text-gray-600">20–30%</span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 mr-1 rounded" style={{ background: "#0ea5e9" }}></span>
                  <span className="text-gray-600">30%+</span>
                </span>
              </div>
            </div>

            <div className="w-full h-96 bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-hidden">
              {/* Row container for columns */}
              <div className="flex h-full w-full">
                {normalizedSegments.map((seg, idx) => {
                  const widthPct = totalSize > 0 ? (seg.market_size / totalSize) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      className="relative h-full border-r last:border-r-0 border-white"
                      style={{ width: `${widthPct}%` }}
                      title={`${seg.name}: $${seg.market_size}B${seg.growth_rate != null ? ` • ${seg.growth_rate}% CAGR` : ""}`}
                    >
                      {/* Column label (top) */}
                      <div className="absolute top-1 left-1 right-1 text-xs font-semibold text-slate-800 truncate">
                        {seg.name}
                      </div>

                      {/* Stacked subsegments */}
                      <div className="absolute bottom-0 left-0 right-0 top-6 flex flex-col">
                        {seg.subsegments!.map((sub, sidx) => (
                          <div
                            key={sidx}
                            className="relative"
                            style={{
                              height: `${sub.share}%`,
                              background: growthColor(sub.growth ?? seg.growth_rate),
                              borderTop: "1px solid rgba(255,255,255,0.8)",
                            }}
                            title={`${sub.name}: ${sub.share.toFixed(1)}%${(sub.growth ?? seg.growth_rate) != null ? ` • ${(sub.growth ?? seg.growth_rate)!.toFixed(0)}% CAGR` : ""}`}
                          >
                            {/* Subsegment label if tall enough */}
                            {sub.share > 10 && (
                              <div className="absolute inset-x-1 bottom-1 text-[11px] text-white drop-shadow-sm truncate">
                                {sub.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Column footer with size */}
                      <div className="absolute bottom-1 left-1 right-1 text-[11px] text-slate-700">
                        ${seg.market_size}B
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              Width = market size (share of total); Height = subsegment mix; Color = growth (CAGR).
            </p>
          </div>

          {/* Table Breakdown */}
          <div className="mt-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Segment Breakdown</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold">Segment</th>
                    <th className="p-3 text-sm font-semibold">Market Size</th>
                    <th className="p-3 text-sm font-semibold">CAGR</th>
                    <th className="p-3 text-sm font-semibold">Subsegments (share • growth)</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {normalizedSegments.map((seg, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-3 font-semibold text-slate-800">{seg.name}</td>
                      <td className="p-3 text-slate-700">${seg.market_size}B</td>
                      <td className="p-3 text-slate-700">{seg.growth_rate != null ? `${seg.growth_rate}%` : "—"}</td>
                      <td className="p-3 text-slate-700">
                        {seg.subsegments!.map((s, j) => (
                          <span key={j} className="inline-flex items-center gap-2 mr-4 mb-1">
                            <span
                              className="inline-block w-3 h-3 rounded"
                              style={{ background: growthColor(s.growth ?? seg.growth_rate) }}
                            />
                            <span className="text-sm">
                              <span className="font-medium">{s.name}</span>{" "}
                              <span className="text-gray-500">
                                ({s.share.toFixed(1)}%{(s.growth ?? seg.growth_rate) != null ? ` • ${(s.growth ?? seg.growth_rate)!.toFixed(0)}%` : ""})
                              </span>
                            </span>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                  {normalizedSegments.length === 0 && (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={4}>
                        No segments available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/mekko")}
              className="px-8 py-3 rounded-full bg-cyan-600 text-white font-semibold shadow-lg hover:bg-cyan-700 hover:shadow-xl transition-all"
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
