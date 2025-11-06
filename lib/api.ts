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
export async function generateMekko({
  market,
  product,
  focus,
  region,
  prompt,
}: {
  market: string;
  product: string;
  focus?: string;
  region?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/app/mekko`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      market,
      product,
      focus,
      region,
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
export async function generateCompetitiveAnalysis({
  company,
  market,
  product,
  competitors,
  goal,
  prompt,
}: {
  company: string;
  market: string;
  product: string;
  competitors?: string;
  goal?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/app/comp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, market, product, competitors, goal, prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function generateBlueOcean({
  industry,
  customer,
  alternatives,
  valueFocus,
  prompt,
}: {
  industry: string;
  customer: string;
  alternatives?: string;
  valueFocus?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/app/blueocean`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ industry, customer, alternatives, valueFocus, prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);  // ← Fixed: added ( before `
  }

  return await response.json();
}

export async function generateFiveBox({
  customer,
  need,
  solution,
  advantage,
  outcome,
  prompt,
}: {
  customer: string;
  need: string;
  solution: string;
  advantage?: string;
  outcome?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/app/5box`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer, need, solution, advantage, outcome, prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
