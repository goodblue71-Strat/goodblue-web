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
export async function generateAnsoff({
  company,
  product,
  market,
  goal,
  prompt,
}: {
  company: string;
  product: string;
  market: string;
  goal: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/app/ansoff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, product, market, goal, prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}
export async function generateTAM({
  company,
  product,
  feature,
  industry,
  region,
  segment,
  avgSpend,
  adoption,
  targetShare,
  prompt,
}: {
  company: string;
  product: string;
  feature?: string;
  industry: string;
  region: string;
  segment: string;
  avgSpend?: number | string;
  adoption?: number | string;
  targetShare?: number | string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/app/tam`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company,
      product,
      feature,
      industry,
      region,
      segment,
      avgSpend,
      adoption,
      targetShare,
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
export async function generatePorter({
  company,
  product,
  industry,
  region,
  prompt,
}: {
  company: string;
  product: string;
  industry: string;
  region: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/app/porters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, product, industry, region, prompt }),
  });

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
}
