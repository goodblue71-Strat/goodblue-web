export async function generateSWOT({
  company,
  product,
  goal,
  feature,
  prompt,
}: {
  company: string;
  product: string;
  goal: string;
  feature?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/app/swot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, product, goal, feature, prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}
