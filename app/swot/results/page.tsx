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

    // Split by common section headers (case insensitive, various formats)
    const strengthsMatch = analysis.match(/(?:\*\*)?Strengths?(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Weaknesses?|Opportunities?|Threats?)(?:\*\*)?:|\s*$)/i);
    const weaknessesMatch = analysis.match(/(?:\*\*)?Weaknesses?(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Strengths?|Opportunities?|Threats?)(?:\*\*)?:|\s*$)/i);
    const opportunitiesMatch = analysis.match(/(?:\*\*)?Opportunities?(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Strengths?|Weaknesses?|Threats?)(?:\*\*)?:|\s*$)/i);
    const threatsMatch = analysis.match(/(?:\*\*)?Threats?(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Strengths?|Weaknesses?|Opportunities?)(?:\*\*)?:|\s*$)/i);

    const extractBullets = (text: string): string[] => {
      if (!text) return [];
      
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
          // Match lines starting with -, *, •, or numbers like 1., 2.
          return line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/);
        })
        .map(line => {
          // Remove the bullet/number prefix
          let cleaned = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim();
          return cleaned;
        })
        .filter(line => line.length > 0);
    };

    if (strengthsMatch && strengthsMatch[1]) {
      parsed.strengths = extractBullets(strengthsMatch[1]);
    }
    if (weaknessesMatch && weaknessesMatch[1]) {
      parsed.weaknesses = extractBullets(weaknessesMatch[1]);
    }
    if (opportunitiesMatch && opportunitiesMatch[1]) {
      parsed.opportunities = extractBullets(opportunitiesMatch[1]);
    }
    if (threatsMatch && threatsMatch[1]) {
      parsed.threats = extractBullets(threatsMatch[1]);
    }

    return parsed;
  };

  // Helper function to parse and render text with bold subtitles
  const renderBulletWithBold = (text: string) => {
    // Split by ** markers and process each part
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    const regex = /\*\*([^*]+)\*\*/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${currentIndex}`}>
            {text.substring(currentIndex, match.index)}
          </span>
        );
      }
      
      // Add the bold part
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add any remaining text after the last bold part
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${currentIndex}`}>
          {text.substring(currentIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  };

  useEffect(() => {
    const storedResult = sessionStorage.getItem("swotResult");
    if (storedResult) {
      const data = JSON.parse(storedResult);
      setResult(data);
      const parsed = parseSWOTAnalysis(data.swot_analysis);
      console.log("Raw SWOT Analysis:", data.swot_analysis);
      console.log("Parsed SWOT:", parsed);
      setParsedSWOT(parsed);
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
              {parsedSWOT.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {parsedSWOT.strengths.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2 text-green-600 font-bold mt-0.5">•</span>
                      <span className="flex-1">{renderBulletWithBold(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No strengths found</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Weaknesses
              </h3>
              {parsedSWOT.weaknesses.length > 0 ? (
                <ul className="space-y-3">
                  {parsedSWOT.weaknesses.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2 text-red-600 font-bold mt-0.5">•</span>
                      <span className="flex-1">{renderBulletWithBold(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No weaknesses found</p>
              )}
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Opportunities
              </h3>
              {parsedSWOT.opportunities.length > 0 ? (
                <ul className="space-y-3">
                  {parsedSWOT.opportunities.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2 text-blue-600 font-bold mt-0.5">•</span>
                      <span className="flex-1">{renderBulletWithBold(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No opportunities found</p>
              )}
            </div>

            {/* Threats */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Threats
              </h3>
              {parsedSWOT.threats.length > 0 ? (
                <ul className="space-y-3">
                  {parsedSWOT.threats.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2 text-orange-600 font-bold mt-0.5">•</span>
                      <span className="flex-1">{renderBulletWithBold(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No threats found</p>
              )}
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
