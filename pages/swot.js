import { useState } from "react";
import { generateSWOT } from "../lib/api";

export default function SWOTPage() {
  const [company, setCompany] = useState("");
  const [goal, setGoal] = useState("");
  const [prompt, setPrompt] = useState("");
  const [swot, setSwot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSwot(null);

    try {
      const data = await generateSWOT({ company, goal, prompt });
      setSwot(data.swot_analysis);
    } catch (err) {
      alert("Error generating SWOT. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">SWOT Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="w-full border p-2 rounded"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Goal (e.g. AI growth strategy)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Optional custom prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate SWOT"}
        </button>
      </form>

      {swot && (
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <pre className="whitespace-pre-wrap">{swot}</pre>
        </div>
      )}
    </div>
  );
}
