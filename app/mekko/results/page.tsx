"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
const showCTA = false;

type Subsegment = {
  name: string;
  share: number; // % within segment (0–100)
  growth?: number; // % CAGR
};

type Segment = {
  name: string;
  market_size: number; // e.g., $B
  growth_rate?: number;
  subsegments?: Subsegment[];
};

interface MekkoResultStored {
  market: string;
  product: string;
  focus?: string;
  region?: string;
  mekko_analysis?: any;
}

interface MekkoParsed {
  summary?: string;
  takeaway?: string;
  segments: Segment[];
}

export default function MekkoResultsPage() {
  const [res, setRes] = useState<MekkoResultStored | null>(null);
  const [parsed, setParsed] = useState<MekkoParsed | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/mekko" && pathname !== "/app/mekko";

  // --- Helpers ---
  const tryParseJSON = (input: any) => {
    if (typeof input !== "string") return input ?? null;
    try {
      return JSON.parse(input.trim());
    } catch {
      return null;
    }
  };

  const cleanText = (text?: string) => (text || "").replace(/```json|```/g, "").trim();

  // More vivid GoodBlue gradient colors by growth %
  const growthColor = (g?: number) => {
    if (g == null) return "#93C5FD"; // default pale blue
    if (g >= 30) return "#0284c7"; // cyan-700
    if (g >= 20) return "#0ea5e9"; // cyan-500
    if (g >= 10) return "#38bdf8"; // cyan-400
    if (g >= 5) return "#60a5fa"; // blue-400
    return "#cbd5e1"; // slate-300 (slow)
  };

  // --- Load session data ---
  useEffect(() => {
    const stored = sessionStorage.getItem("mekkoResult");
    if (!stored) {
      router.push("/mekko");
      return;
    }

    let result: MekkoResultStored = JSON.parse(stored);
    let analysis = result.mekko_analysis;

    let obj = tryParseJSON(analysis) ?? analysis;

    if (obj && typeof obj === "object" && typeof obj.summary === "string") {
      const inner = tryParseJSON(obj.summary);
      if (inner) {
        obj.summary = inner.summary ?? obj.summary;
        obj.takeaway = inner.takeaway ?? "";
        obj.segments = inner.segments ?? obj.segments;
      }
    }

    let segments: Segment[] = [];
    let summary: string | undefined;
    let takeaway: string | undefined;

    if (obj && typeof obj === "object") {
      summary = cleanText(obj.summary);
      takeaway = cleanText(obj.recommendation ?? obj.takeaway);

      const segs = Array.isArray(obj.segments) ? obj.segments : [];
      segments = segs.map((s: any) => ({
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
      }));
    }

    // fallback demo
    if (!segments?.length) {
      segments = [
        {
          name: "Segment A",
          market_size: 40,
          growth_rate: 12,
          subsegments: [
            { name: "Sub A1", share: 50, growth: 10 },
            { name: "Sub A2", share: 30, growth: 15 },
            { name: "Sub A3", share: 20, growth: 6 },
          ],
        },
        {
          name: "Segment B",
          market_size: 35,
          growth_rate: 20,
          subsegments: [
            { name: "Sub B1", share: 60, growth: 22 },
            { name: "Sub B2", share: 40, growth: 18 },
          ],
        },
        {
          name: "Segment C",
          market_size: 25,
          growth_rate: 8,
          subsegments: [
            { name: "Sub C1", share: 70, growth: 9 },
            { name: "Sub C2", share: 30, growth: 6 },
          ],
        },
      ];
      summary =
        summary ??
        "Illustrative market map: Segment A dominates share, Segment B accelerates fastest, while Segment C matures.";
      takeaway =
        takeaway ??
        "The market is moderately consolidated. High-growth opportunities exist in mid-sized segments with 15–25% CAGR potential.";
    }

    setRes(result);
    setParsed({ summary, takeaway, segments });
  }, [router]);

  const totalSize = useMemo(
    () => parsed?.segments.reduce((a, s) => a + (s.market_size || 0), 0) || 0,
    [parsed]
  );

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

  const { market, product, region, focus } = res;

  const formatSummary = (text: string) =>
    text.split(/\n+/).filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-cyan-700 mb-2">
            Market Structure (Mekko)
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            {market && <span className="font-semibold">{market}</span>}
            {product && ` – ${product}`}
            {(region || focus) && (
              <span className="text-sm text-gray-500 ml-2">
                {region ? region : ""}
                {region && focus ? " • " : ""}
                {focus ? focus : ""}
              </span>
            )}
          </p>

          {/* Summary */}
          {parsed.summary && (
            <div className="mb-10 p-8 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-cyan-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-cyan-900">Executive Summary</h2>
              </div>
              {formatSummary(parsed.summary).map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Mekko Visualization */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Map</h2>
          <div className="w-full h-96 bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-hidden">
            <div className="flex h-full w-full">
              {normalizedSegments.map((seg, idx) => {
                const widthPct = totalSize > 0 ? (seg.market_size / totalSize) * 100 : 0;
                return (
                  <div
                    key={idx}
                    className="relative h-full border-r last:border-r-0 border-white"
                    style={{ width: `${widthPct}%` }}
                  >
                    {/* Subsegments */}
                    <div className="absolute inset-x-0 bottom-6 flex flex-col-reverse h-[calc(100%-1.5rem)]">
                      {seg.subsegments!.map((sub, sidx) => (
                        <div
                          key={sidx}
                          className="relative"
                          style={{
                            height: `${sub.share}%`,
                            background: growthColor(sub.growth ?? seg.growth_rate),
                            borderTop: "1px solid rgba(255,255,255,0.8)",
                          }}
                        >
                          {sub.share > 10 && (
                            <div className="absolute inset-x-1 top-1 text-[11px] text-white font-semibold truncate drop-shadow">
                              {sub.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 text-center text-[12px] font-semibold text-slate-800">
                      {seg.name}
                      <div className="text-[11px] text-slate-600">
                        ${seg.market_size}B • {seg.growth_rate}% CAGR
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            Width = Market size; Height = Subsegment share; Color = Growth rate (CAGR)
          </p>

          {/* Breakdown Table */}
          <div className="mt-10 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Segment Breakdown</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold">Segment</th>
                    <th className="p-3 text-sm font-semibold">Market Size</th>
                    <th className="p-3 text-sm font-semibold">CAGR</th>
                    <th className="p-3 text-sm font-semibold">Subsegments</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {normalizedSegments.map((seg, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-3 font-semibold text-slate-800">{seg.name}</td>
                      <td className="p-3 text-slate-700">${seg.market_size}B</td>
                      <td className="p-3 text-slate-700">
                        {seg.growth_rate != null ? `${seg.growth_rate}%` : "—"}
                      </td>
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
                                ({s.share.toFixed(1)}% • {s.growth ?? seg.growth_rate}%)
                              </span>
                            </span>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Takeaway */}
          {parsed.takeaway && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-cyan-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-cyan-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-cyan-900">Strategic Takeaway</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{parsed.takeaway}</p>
            </div>
          )}

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
