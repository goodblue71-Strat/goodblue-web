"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AnsoffResult {
  company: string;
  product: string;
  market: string;
  goal: string;
  ansoff_analysis: string;
}

interface ParsedAnsoff {
  marketPenetration: string[];
  marketDevelopment: string[];
  productDevelopment: string[];
  diversification: string[];
}

export default function AnsoffResultsPage() {
  const [result, setResult] = useState<AnsoffResult | null>(null);
  const [parsedAnsoff, setParsedAnsoff] = useState<ParsedAnsoff | null>(null);
  const router = useRouter();

  const parseAnsoffAnalysis = (analysis: string): ParsedAnsoff => {
    const parsed: ParsedAnsoff = {
      marketPenetration: [],
      marketDevelopment: [],
      productDevelopment: [],
      diversification: [],
    };

    const marketPenetrationMatch = analysis.match(/(?:\*\*)?Market Penetration(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Market Development|Product Development|Diversification)(?:\*\*)?:|\s*$)/i);
    const marketDevelopmentMatch = analysis.match(/(?:\*\*)?Market Development(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Market Penetration|Product Development|Diversification)(?:\*\*)?:|\s*$)/i);
    const productDevelopmentMatch = analysis.match(/(?:\*\*)?Product Development(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Market Penetration|Market Development|Diversification)(?:\*\*)?:|\s*$)/i);
    const diversificationMatch = analysis.match(/(?:\*\*)?Diversification(?:\*\*)?:?\s*([\s\S]*?)(?=(?:\*\*)?(?:Market Penetration|Market Development|Product Development)(?:\*\*)?:|\s*$)/i);

    const extractBullets = (text: string): string[] => {
      if (!text) return [];
      
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/))
        .map(line => line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim())
        .filter(line => line.length > 0);
    };

    if (marketPenetrationMatch && marketPenetrationMatch[1]) {
      parsed.marketPenetration = extractBullets(marketPenetrationMatch[1]);
    }
    if (marketDevelopmentMatch && marketDevelopmentMatch[1]) {
      parsed.marketDevelopment = extractBullets(marketDevelopmentMatch[1]);
    }
    if (productDevelopmentMatch && productDevelopmentMatch[1]) {
      parsed.productDevelopment = extractBullets(productDevelopmentMatch[1]);
    }
    if (diversificationMatch && diversificationMatch[1]) {
      parsed.diversification = extractBullets(diversificationMatch[1]);
    }

    return parsed;
  };

  const renderBulletWithBold = (text: string) => {
    // Check if the line starts with **subtitle**
    const subtitleMatch = text.match(/^\*\*([^*]+)\*\*:?\s*(.*)/s);
    
    if (subtitleMatch) {
      const subtitle = subtitleMatch[1];
      const content = subtitleMatch[2].trim();
      
      // Check if subtitle already ends with colon
      const hasColon = subtitle.endsWith(':');
      
      return (
        <div className="mb-3">
          <div className="mb-1">
            <span className="mr-2 text-current font-bold">•</span>
            <strong className="font-semibold">
              {hasColon ? subtitle : `${subtitle}:`}
            </strong>
          </div>
          {content && (
            <div className="ml-5 text-gray-600 leading-relaxed">{content}</div>
          )}
        </div>
      );
    }
    
    // If no subtitle pattern found, display as plain text with bullet
    return (
      <div className="mb-3">
        <span className="mr-2 text-current font-bold">•</span>
        <span>{text}</span>
      </div>
    );
  };

  useEffect(() => {
    const storedResult = sessionStorage.getItem("ansoffResult");
    if (storedResult) {
      const data = JSON.parse(storedResult);
      setResult(data);
      const parsed = parseAnsoffAnalysis(data.ansoff_analysis);
      console.log("Raw Ansoff Analysis:", data.ansoff_analysis);
      console.log("Parsed Ansoff:", parsed);
      setParsedAnsoff(parsed);
    } else {
      router.push("/ansoff");
    }
  }, [router]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("ansoffResult");
    router.push("/ansoff");
  };

  if (!result || !parsedAnsoff) {
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
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
            Ansoff Matrix Results
          </h1>
          
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Analysis Details</h2>
            <div className="space-y-1 text-gray-700">
              <p><strong>Company:</strong> {result.company}</p>
              <p><strong>Product:</strong> {result.product}</p>
              <p><strong>Market:</strong> {result.market}</p>
              <p><strong>Goal:</strong> {result.goal}</p>
            </div>
          </div>

          {/* Ansoff Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Market Penetration */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Market Penetration
              </h3>
              <p className="text-sm text-gray-600 mb-3 italic">Existing Markets + Existing Products</p>
              {parsedAnsoff.marketPenetration.length > 0 ? (
                <div className="text-blue-900">
                  {parsedAnsoff.marketPenetration.map((item, index) => (
                    <div key={index}>
                      {renderBulletWithBold(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No strategies found</p>
              )}
            </div>

            {/* Market Development */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">🌍</span> Market Development
              </h3>
              <p className="text-sm text-gray-600 mb-3 italic">New Markets + Existing Products</p>
              {parsedAnsoff.marketDevelopment.length > 0 ? (
                <div className="text-green-900">
                  {parsedAnsoff.marketDevelopment.map((item, index) => (
                    <div key={index}>
                      {renderBulletWithBold(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No strategies found</p>
              )}
            </div>

            {/* Product Development */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <span className="mr-2">🚀</span> Product Development
              </h3>
              <p className="text-sm text-gray-600 mb-3 italic">Existing Markets + New Products</p>
              {parsedAnsoff.productDevelopment.length > 0 ? (
                <div className="text-orange-900">
                  {parsedAnsoff.productDevelopment.map((item, index) => (
                    <div key={index}>
                      {renderBulletWithBold(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No strategies found</p>
              )}
            </div>

            {/* Diversification */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Diversification
              </h3>
              <p className="text-sm text-gray-600 mb-3 italic">New Markets + New Products</p>
              {parsedAnsoff.diversification.length > 0 ? (
                <div className="text-red-900">
                  {parsedAnsoff.diversification.map((item, index) => (
                    <div key={index}>
                      {renderBulletWithBold(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No strategies found</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNewAnalysis}
              className="flex-1 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors"
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
