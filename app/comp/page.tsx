"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateCompetitiveAnalysis } from "../../lib/api";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB per file
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB total
const MAX_FILE_COUNT = 10;

export default function CompetitiveAnalysisPage() {
  const [company, setCompany] = useState("");
  const [market, setMarket] = useState("");
  const [product, setProduct] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [goal, setGoal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const showCTA = pathname !== "/comp" && pathname !== "/app/comp";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getTotalSize = (fileList: File[]) => {
    return fileList.reduce((sum, f) => sum + f.size, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);

    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Check file count
      if (files.length + newFiles.length > MAX_FILE_COUNT) {
        setFileError(`Maximum ${MAX_FILE_COUNT} files allowed`);
        return;
      }

      // Check individual file sizes
      const oversizedFiles = newFiles.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        setFileError(
          `Files must be under 10MB: ${oversizedFiles.map((f) => f.name).join(", ")}`
        );
        return;
      }

      // Check total size
      const currentSize = getTotalSize(files);
      const newSize = getTotalSize(newFiles);
      if (currentSize + newSize > MAX_TOTAL_SIZE) {
        setFileError(
          `Total upload size cannot exceed 25MB (current: ${formatFileSize(currentSize + newSize)})`
        );
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateCompetitiveAnalysis({
        company,
        market,
        product,
        competitors: competitors || undefined,
        goal: goal || undefined,
        prompt: prompt || undefined,
        files: files.length > 0 ? files : undefined,
      });
      sessionStorage.setItem(
        "compResult",
        JSON.stringify({
          company,
          market,
          product,
          competitors,
          goal,
          competitive_analysis: data.competitive_analysis,
          pptx_path: data.pptx_path,
        })
      );

      router.push("/comp/results");
    } catch (err) {
      console.error(err);
      alert("Error generating competitive analysis");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 relative">
      <Navbar showCTA={showCTA} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex space-x-2 mb-4">
            <span className="w-3 h-3 bg-blue-700 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
          <p className="text-blue-700 font-semibold text-lg">
            Generating competitive insights...
          </p>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 transition-all">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-700">
            Competitive Analysis Generator
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Understand rival positioning, differentiation, and strategic responses
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., GoodBlue"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market or Category
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AI SaaS, Energy Tech"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product or Offering
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Strategy Copilot"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Competitors (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Competitor A, Competitor B"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategic Goal (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., increase market share, differentiate pricing"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., highlight pricing battles or product roadmap gaps"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              ></textarea>
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Documents (optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                PDF, Word, Excel, or PowerPoint files to enhance analysis (max 1 MB per file, 5MB total)
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Click to upload files
                </label>
                <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              </div>

              {/* Error Message */}
              {fileError && (
                <p className="mt-2 text-sm text-red-600">{fileError}</p>
              )}

              {/* File List Preview */}
              {files.length > 0 && (
                <>
                  <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                      >
                        <span className="truncate max-w-xs">
                          {file.name}{" "}
                          <span className="text-gray-400">
                            ({formatFileSize(file.size)})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-gray-500">
                    Total: {formatFileSize(getTotalSize(files))} / 5MB
                  </p>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-800 disabled:bg-gray-400 transition-all"
            >
              {loading ? "Analyzing..." : "Generate Competitive Analysis"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
