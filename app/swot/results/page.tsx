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

export default function SWOTResultsPage() {
  const [result, setResult] = useState<SWOTResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedResult = sessionStorage.getItem("swotResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // Redirect to input page if no result found
      router.push("/swot");
    }
  }, [router]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("swotResult");
    router.push("/swot");
  };

  if (!result) {
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
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
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

          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              SWOT Analysis
            </h2>
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {result.swot_analysis}
            </pre>
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
