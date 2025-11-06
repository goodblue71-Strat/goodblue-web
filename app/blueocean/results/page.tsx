"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ValueFactor = {
  name: string;
  industryLevel?: number;
  yourLevel?: number;
  insight?: string;
};

interface BlueOceanStored {
  industry: string;
  customer: string;
  alternatives?: string;
  valueFocus?: string;
  blue_ocean_canvas?: any;
}

interface BlueOceanParsed {
  summary: string[];
  eliminate: string[];
  reduce: string[];
  raise: string[];
  create: string[];
  factors: ValueFactor[];
  playbook: string[];
}

const defaultSummary = [
  "The industry competes on breadth and concierge support, but buyers overpay for complexity they rarely use.",
  "A differentiated move combines automation and community to unlock a new value curve for time-starved operators.",
];

const defaultFactors: ValueFactor[] = [
  { name: "Feature breadth", industryLevel: 5, yourLevel: 2, insight: "Eliminate under-used features to simplify the experience." },
  { name: "Concierge service", industryLevel: 4, yourLevel: 3, insight: "Reduce bespoke services by productizing onboarding." },
  { name: "Automation", industryLevel: 2, yourLevel: 5, insight: "Raise automation to collapse manual handoffs." },
  { name: "Community proof", industryLevel: 1, yourLevel: 5, insight: "Create practitioner community to drive peer validation." },
  { name: "Pricing transparency", industryLevel: 2, yourLevel: 4, insight: "Raise transparency with usage-based tiers." },
];

const defaultERRC = {
  eliminate: ["Feature overload", "One-off customization requests"],
  reduce: ["Consulting-heavy onboarding", "Long procurement cycles"],
  raise: ["Automation depth", "Self-serve analytics", "Pricing clarity"],
  create: ["Community benchmarking", "Outcome-based success plans"],
};

const defaultPlaybook = [
  "Launch an automation audit that highlights redundant steps removed for each buyer persona.",
  "Bundle community membership and benchmarking insights into premium tiers.",
  "Deploy transparent pricing calculator aligned to outcomes instead of seat counts.",
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

const normalizeLevel = (value: any): number | undefined => {
  if (value == null || value === "") return undefined;
  const num = Number(value);
  if (Number.isNaN(num)) return undefined;
  return Math.min(5, Math.max(0, Math.round(num)));
};

const toFactors = (value: any): ValueFactor[] => {
  if (!value) return [];
  const list = Array.isArray(value)
    ? value
    : typeof value === "object"
    ? Object.values(value)
    : [];

  return list
    .map((item: any) => {
      if (!item) return null;
      if (typeof item === "string") {
        return {
          name: item,
        } as ValueFactor;
      }

      return {
        name: item.name ?? item.factor ?? "Value factor",
        industryLevel:
          normalizeLevel(item.industry_level ?? item.current ?? item.existing ?? item.as_is),
        yourLevel: normalizeLevel(item.new_level ?? item.proposed ?? item.to_be ?? item.future),
        insight: cleanText(item.insight ?? item.note ?? item.observation ?? item.rationale),
      } as ValueFactor;
    })
    .filter(Boolean) as ValueFactor[];
};

export default function BlueOceanResultsPage() {
  const [stored, setStored] = useState<BlueOceanStored | null>(null);
  const [parsed, setParsed] = useState<BlueOceanParsed | null>(null);

  const router = useRouter();
  const showCTA = false;

  useEffect(() => {
    const raw = sessionStorage.getItem("blueoceanResult");
    if (!raw) {
      router.push("/blueocean");
      return;
    }

    const base: BlueOceanStored = JSON.parse(raw);
    const analysis = base.blue_ocean_canvas;
    let obj = tryParseJSON(analysis) ?? analysis;

    if (obj && typeof obj === "object" && typeof obj.summary === "string") {
      const inner = tryParseJSON(obj.summary);
      if (inner) {
        obj.summary = inner.summary ?? obj.summary;
        obj.eliminate = inner.eliminate ?? obj.eliminate;
        obj.reduce = inner.reduce ?? obj.reduce;
        obj.raise = inner.raise ?? obj.raise;
        obj.create = inner.create ?? obj.create;
        obj.factors = inner.factors ?? obj.factors;
        obj.playbook = inner.playbook ?? obj.playbook;
      }
    }

    const summary = toList(obj?.summary);
    const eliminate = toList(obj?.eliminate);
    const reduce = toList(obj?.reduce);
    const raise = toList(obj?.raise);
    const create = toList(obj?.create ?? obj?.innovate);
    const factors = toFactors(obj?.factors ?? obj?.value_curve ?? obj?.value_factors);
    const playbook = toList(obj?.playbook ?? obj?.next_moves ?? obj?.actions);

    setStored(base);
    setParsed({
      summary: summary.length ? summary : defaultSummary,
      eliminate: eliminate.length ? eliminate : defaultERRC.eliminate,
      reduce: reduce.length ? reduce : defaultERRC.reduce,
      raise: raise.length ? raise : defaultERRC.raise,
      create: create.length ? create : defaultERRC.create,
      factors: factors.length ? factors : defaultFactors,
      playbook: playbook.length ? playbook : defaultPlaybook,
    });
  }, [router]);

  if (!stored || !parsed) return null;

  const { industry, customer, alternatives, valueFocus } = stored;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">Blue Ocean Canvas</h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            {industry && <span className="font-semibold">{industry}</span>}
            {customer && ` – ${customer}`}
            {(alternatives || valueFocus) && (
              <span className="text-sm text-gray-500 ml-2">
                {alternatives ? `Alt: ${alternatives}` : ""}
                {alternatives && valueFocus ? " • " : ""}
                {valueFocus ? valueFocus : ""}
              </span>
            )}
          </p>

          {parsed.summary.length > 0 && (
            <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-blue-900">Strategic Narrative</h2>
              </div>
              {parsed.summary.map((line, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-3">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="mb-10 grid gap-6 lg:grid-cols-4">
            {[
              { title: "Eliminate", items: parsed.eliminate, tone: "bg-red-50 border-red-200 text-red-900" },
              { title: "Reduce", items: parsed.reduce, tone: "bg-orange-50 border-orange-200 text-orange-900" },
              { title: "Raise", items: parsed.raise, tone: "bg-blue-50 border-blue-200 text-blue-900" },
              { title: "Create", items: parsed.create, tone: "bg-emerald-50 border-emerald-200 text-emerald-900" },
            ].map(({ title, items, tone }) => (
              <div key={title} className={`rounded-2xl border shadow-sm p-6 ${tone}`}>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <ul className="space-y-2 text-sm">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Value Curve Shift</h2>
            <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm divide-y">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span className="col-span-3">Factor</span>
                <span className="col-span-3">Industry Level</span>
                <span className="col-span-3">Your Play</span>
                <span className="col-span-3">Insight</span>
              </div>
              {parsed.factors.map((factor, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center">
                  <span className="col-span-3 font-semibold text-slate-800">{factor.name}</span>
                  <div className="col-span-3">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400"
                        style={{ width: `${((factor.industryLevel ?? 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      {factor.industryLevel != null ? factor.industryLevel : "—"}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${((factor.yourLevel ?? 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      {factor.yourLevel != null ? factor.yourLevel : "—"}
                    </span>
                  </div>
                  <span className="col-span-3 text-gray-600">{factor.insight || ""}</span>
                </div>
              ))}
            </div>
          </div>

          {parsed.playbook.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Launch Playbook</h2>
              <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  {parsed.playbook.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/blueocean")}
              className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all"
            >
              New Canvas
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
