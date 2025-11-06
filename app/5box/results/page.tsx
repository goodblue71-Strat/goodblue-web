"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type StrategyBox = {
  label: string;
  content: string;
  proof?: string;
  metric?: string;
};

interface FiveBoxStored {
  customer: string;
  need: string;
  solution: string;
  advantage?: string;
  outcome?: string;
  five_box_strategy?: any;
}

interface FiveBoxParsed {
  summary: string[];
  boxes: StrategyBox[];
  nextSteps: string[];
  metrics: string[];
}

const defaultBoxes: StrategyBox[] = [
  {
    label: "Customer",
    content: "Growth-stage product marketers who juggle multiple launches each quarter.",
  },
  {
    label: "Need",
    content: "They must deliver executive-ready narratives without waiting on fragmented data teams.",
  },
  {
    label: "Solution",
    content: "An AI strategy co-pilot that orchestrates research, synthesis, and storytelling in minutes.",
  },
  {
    label: "Proof / Differentiator",
    content: "Benchmarks from 1,200+ GTM plans and ex-consultant playbooks packaged as prompts.",
    proof: "Trusted by 40 design partners; NPS 72; 3x faster deck creation in pilot cohort.",
  },
  {
    label: "Outcome",
    content: "Aligned launch decisions within a week and measurable uplift in win-rate per initiative.",
    metric: "Target: 50% reduction in time-to-decision and 10% lift in conversion.",
  },
];

const defaultSummary = [
  "Messaging and sequencing are fractured across teams; leaders need a single narrative spine.",
  "Codifying expertise into reusable plays creates leverage and frees teams for experimentation.",
];

const defaultNextSteps = [
  "Convert the five boxes into two slide narrative and circulate for cross-functional alignment.",
  "Instrument a lightweight scorecard to track outcome metrics and customer proof points.",
  "Run an enablement session mapping discovery questions to each box.",
];

const defaultMetrics = [
  "Time to final strategy sign-off",
  "Executive satisfaction (pulse survey)",
  "Launch velocity vs. baseline",
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

const toList = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => cleanText(String(item))).filter(Boolean);
  if (typeof value === "string") {
    return cleanText(value)
      .split(/\n+|•|- |\*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const toBoxes = (value: any, stored: FiveBoxStored): StrategyBox[] => {
  const boxes: StrategyBox[] = [];
  const list = Array.isArray(value)
    ? value
    : typeof value === "object" && value !== null
    ? Object.values(value)
    : [];

  list.forEach((item: any) => {
    if (!item) return;
    if (typeof item === "string") {
      boxes.push({ label: "Insight", content: cleanText(item) });
      return;
    }

    boxes.push({
      label: cleanText(item.label ?? item.name ?? item.title ?? "Insight"),
      content: cleanText(item.content ?? item.description ?? item.value ?? ""),
      proof: cleanText(item.proof ?? item.evidence ?? ""),
      metric: cleanText(item.metric ?? item.kpi ?? ""),
    });
  });

  if (!boxes.length) {
    boxes.push(
      { label: "Customer", content: stored.customer },
      { label: "Need", content: stored.need },
      { label: "Solution", content: stored.solution },
      {
        label: "Proof / Differentiator",
        content: stored.advantage || "Surface quantitative proof of traction or expertise.",
      },
      {
        label: "Outcome",
        content: stored.outcome || "Define the measurable change you enable.",
      }
    );
  }

  return boxes;
};

export default function FiveBoxResultsPage() {
  const [stored, setStored] = useState<FiveBoxStored | null>(null);
  const [parsed, setParsed] = useState<FiveBoxParsed | null>(null);

  const router = useRouter();
  const showCTA = false;

  useEffect(() => {
    const raw = sessionStorage.getItem("fiveBoxResult");
    if (!raw) {
      router.push("/5box");
      return;
    }

    const base: FiveBoxStored = JSON.parse(raw);
    const analysis = base.five_box_strategy;
    let obj = tryParseJSON(analysis) ?? analysis;

    if (obj && typeof obj === "object" && typeof obj.summary === "string") {
      const inner = tryParseJSON(obj.summary);
      if (inner) {
        obj.summary = inner.summary ?? obj.summary;
        obj.boxes = inner.boxes ?? obj.boxes;
        obj.next_steps = inner.next_steps ?? obj.next_steps;
        obj.metrics = inner.metrics ?? obj.metrics;
      }
    }

    const summary = toList(obj?.summary);
    const boxes = toBoxes(obj?.boxes ?? obj?.grid ?? obj?.five_box ?? obj?.pillars, base);
    const nextSteps = toList(obj?.next_steps ?? obj?.actions ?? obj?.plan);
    const metrics = toList(obj?.metrics ?? obj?.kpis ?? obj?.signals);

    setStored(base);
    setParsed({
      summary: summary.length ? summary : defaultSummary,
      boxes: boxes.length ? boxes : defaultBoxes,
      nextSteps: nextSteps.length ? nextSteps : defaultNextSteps,
      metrics: metrics.length ? metrics : defaultMetrics,
    });
  }, [router]);

  if (!stored || !parsed) return null;

  const { customer, need, solution, advantage, outcome } = stored;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
            5-Box Strategy Grid
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            {customer && <span className="font-semibold">{customer}</span>}
            {need && ` • ${need}`}
            {(solution || advantage || outcome) && (
              <span className="text-sm text-gray-500 ml-2">
                {solution ? solution : ""}
                {solution && (advantage || outcome) ? " | " : ""}
                {advantage ? advantage : ""}
                {advantage && outcome ? " → " : ""}
                {outcome ? outcome : ""}
              </span>
            )}
          </p>

          {parsed.summary.length > 0 && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Narrative Snapshot</h2>
              </div>
              {parsed.summary.map((line, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-3">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">
            {parsed.boxes.map((box, idx) => (
              <div
                key={`${box.label}-${idx}`}
                className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-6 flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">{box.label}</h3>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{box.content}</p>
                </div>
                {box.proof && (
                  <div className="text-xs text-gray-500 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-3">
                    <span className="font-semibold text-blue-700">Proof: </span>
                    {box.proof}
                  </div>
                )}
                {box.metric && (
                  <div className="text-xs text-gray-500 border border-gray-200 rounded-xl px-4 py-3">
                    <span className="font-semibold text-gray-700">Metric: </span>
                    {box.metric}
                  </div>
                )}
              </div>
            ))}
          </div>

          {parsed.nextSteps.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Next Strategic Moves</h2>
              <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  {parsed.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {parsed.metrics.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Signals to Monitor</h2>
              <div className="flex flex-wrap gap-3">
                {parsed.metrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-sm text-blue-800"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/5box")}
              className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all"
            >
              New Grid
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
