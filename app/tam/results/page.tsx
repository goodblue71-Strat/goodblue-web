"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Updated interface with index signature
interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number; // Add this index signature
}

interface TableRow {
  layer: string;
  value: string;
  assumptions: string;
}

interface TAMResult {
  company: string;
  product: string;
  industry: string;
  region: string;
  segment: string;
  tam_sam_som_analysis?: {
    data?: ChartDataItem[];
    summary?: string;
    table?: TableRow[];
  };
}

export default function TAMResultsPage() {
  const [result, setResult] = useState<TAMResult | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const showCTA = pathname !== "/tam" && pathname !== "/app/tam";

  // Load stored result from session
  useEffect(() => {
    const stored = sessionStorage.getItem("tamResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/tam");
    }
  }, [router]);

  if (!result) return null;

  const { company, product, industry, region, segment, tam_sam_som_analysis } = result;

  // Fallback in case the API doesn't return structured data yet
  const chartData: ChartDataItem[] =
    tam_sam_som_analysis?.data || [
      { name: "TAM", value: 100 },
      { name: "SAM", value: 20 },
      { name: "SOM", value: 5 },
    ];

  const COLORS = ["#93C5FD", "#3B82F6", "#1E40AF"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            TAM / SAM / SOM Results
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {company && <span className="font-medium">{company}</span>}{" "}
            {product && `– ${product}`} in{" "}
            {industry && <span className="font-medium">{industry}</span>}{" "}
            ({region}, {segment})
          </p>

          {/* Chart Section */}
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry: ChartDataItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Textual Insights */}
          <div className="mt-10 space-y-4">
            {tam_sam_som_analysis?.summary ? (
              <p className="text-lg text-gray-700 leading-relaxed">
                {tam_sam_som_analysis.summary}
              </p>
            ) : (
              <p className="text-gray-500 italic text-center">
                The AI model did not return a detailed summary. This section will populate once
                your backend generates structured results.
              </p>
            )}

            {tam_sam_som_analysis?.table && (
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 font-semibold text-gray-700">Layer</th>
                      <th className="p-3 font-semibold text-gray-700">Market Size</th>
                      <th className="p-3 font-semibold text-gray-700">Assumptions / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tam_sam_som_analysis.table.map((row: TableRow, i: number) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-medium text-gray-800">{row.layer}</td>
                        <td className="p-3 text-gray-700">{row.value}</td>
                        <td className="p-3 text-gray-600">{row.assumptions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => router.push("/tam")}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Back to TAM Input
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
