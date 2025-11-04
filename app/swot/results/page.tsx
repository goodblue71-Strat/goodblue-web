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
}

export default function SWOTResultsPage() {
  const [result, setResult] = useState<SWOTResult | null>(null);
  const [parsedSWOT, setParsedSWOT] = useState<ParsedSWOT | null>(null);
  const router = useRouter();

  const parseSWOTAnalysis = (analysis: string): ParsedSWOT => {
    const parsed: ParsedSWOT = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };

    const sections = analysis.split(/\*\*(?:Strengths?|Weaknesses?|Opportunities?|Threats?):\*\*/i);
    const headers = analysis.match(/\*\*(?:Strengths?|Weaknesses?|Opportunities?|Threats?):\*\*/gi) || [];

    headers.forEach((header, index) => {
      const sectionText = sections[index + 1];
      if (!sectionText) return;

      // Extract bullet points (lines starting with -, *, or •)
      const bullets = sectionText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^[-*•]\s+/))
        .map(line => line.replace(/^[-*•]\s+/, ''));

      const headerLower = header.toLowerCase();
      if (headerLower.includes('strength')) {
        parsed.strengths = bullets;
      } else if (headerLower.includes('weakness')) {
        parsed.weaknesses = bullets;
      } else if (headerLower.includes('opportunit')) {
        parsed.opportunities = bullets;
      } else if (headerLower.includes('threat')) {
        parsed.threats = bullets;
      }
    });

    return parsed;
  };

  useEffect(() => {
    const storedResult = sessionStorage.getItem("swotResult");
    if (storedResult) {
      const data = JSON.parse(storedResult);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={false} />
      <main className="flex-grow px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            SWOT Analysis Results
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Analysis Details</h2>
            <div className="space-y-1 text-gray-700">
              <p><strong>Company:</strong> {result.company}</p>
              <p><strong>Product:</strong> {result.product}</p>
              <p><strong>Goal:</strong> {result.goal}</p>
              {result.feature && <p><strong>Feature:</strong> {result.feature}</p>}
            </div>
          </div>

          {/* SWOT Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Strengths */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">💪</span> Strengths
              </h3>
              <ul className="space-y-2">
                {parsedSWOT.strengths.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2 text-green-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Weaknesses
              </h3>
              <ul className="space-y-2">
                {parsedSWOT.weaknesses.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2 text-red-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Opportunities
              </h3>
              <ul className="space-y-2">
                {parsedSWOT.opportunities.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2 text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Threats
              </h3>
              <ul className="space-y-2">
                {parsedSWOT.threats.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2 text-orange-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNewAnalysis}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
