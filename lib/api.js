// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function generateSWOT({ company, goal, prompt }) {
  try {
    const response = await fetch(`${API_BASE}/app/swot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, goal, prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("SWOT API error:", err);
    throw err;
  }
}
