"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
  assumptions?: string;
  [key: string]: string | number | undefined;
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

  const chartData: ChartDataItem[] =
    tam_sam_som_analysis?.data || [
      { name: "TAM", value: 100 },
      { name: "SAM", value: 20 },
      { name: "SOM", value: 5 },
    ];

  const COLORS = ["#93C5FD", "#3B82F6", "#1E40AF"];

  // Custom label renderer - positioned outside with smaller font
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "14px", fontWeight: "500" }}
      >
        {`${name}: $${value}B`}
      </text>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA={showCTA} />

      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
            TAM / SAM / SOM Analysis
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            {company && <span className="font-semibold">{company}</span>}
            {product && ` – ${product}`}
            {industry && (
              <>
                {" "}in <span className="font-semibold">{industry}</span>
              </>
            )}
            <br />
            <span className="text-sm text-gray-500">
              {region} • {segment}
            </span>
          </p>

          {/* Summary Section */}
          {tam_sam_som_analysis?.summary && (
            <div className="mb-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-3">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                {tam_sam_som_analysis.summary}
              </p>
            </div>
          )}

          {/* Market Size Table */}
          {tam_sam_som_analysis?.table && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Size Breakdown</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="p-4 font-semibold">Market Layer</th>
                      <th className="p-4 font-semibold">Market Size</th>
                      <th className="p-4 font-semibold">Key Assumptions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {tam_sam_som_analysis.table.map((row: TableRow, i: number) => (
                      <tr
                        key={i}
                        className={`border-t border-gray-200 hover:bg-blue-50 transition-colors ${
                          i === 0 ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-blue-700 text-lg">{row.layer}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-xl font-bold text-gray-900">{row.value}</span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm leading-relaxed">
                          {row.assumptions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Market Visualization
            </h2>
            <div className="w-full h-96 bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={renderCustomLabel}
                    labelLine={true}
                  >
                    {chartData.map((entry: ChartDataItem, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value} Billion`}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e5e7eb',
                      padding: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={50}
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="font-medium text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              All values shown in Billions (USD)
            </p>
          </div>

          {/* Detailed Assumptions */}
          {chartData.length > 0 && chartData[0].assumptions && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Assumptions</h2>
              <div className="space-y-4">
                {chartData.map((item: ChartDataItem, index: number) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border-l-4"
                    style={{ borderColor: COLORS[index % COLORS.length] }}
                  >
                    <h3 className="font-bold text-lg mb-2" style={{ color: COLORS[index % COLORS.length] }}>
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.assumptions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/tam")}
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
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
