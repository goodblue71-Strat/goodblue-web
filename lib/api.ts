const sanitizeText = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const normalizeTextList = (value?: string | string[]) => {
  if (!value) return [];

  const items = Array.isArray(value) ? value : value.split(/[\n,]+/);
  const result: string[] = [];

  for (const entry of items) {
    if (typeof entry !== "string") continue;
    const segments = entry.split(/[\n,]+/);
    for (const segment of segments) {
      const trimmed = segment.trim();
      if (trimmed) {
        result.push(trimmed);
      }
    }
  }

  return result;
};

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
  market,
  product,
  competitors,
  focus,
  prompt,
}: {
  market: string;
  product: string;
  competitors: string | string[];
  focus?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const competitorList = normalizeTextList(competitors);

  if (competitorList.length === 0) {
    throw new Error("At least one competitor is required.");
  }

  const sanitizedMarket = sanitizeText(market);
  const sanitizedProduct = sanitizeText(product);

  if (!sanitizedMarket) {
    throw new Error("Market is required.");
  }

  if (!sanitizedProduct) {
    throw new Error("Product is required.");
  }

  const payload: Record<string, unknown> = {
    market: sanitizedMarket,
    product: sanitizedProduct,
    competitors: competitorList,
  };

  const focusText = sanitizeText(focus);
  if (focusText) {
    payload.focus = focusText;
  }

  const promptText = sanitizeText(prompt);
  if (promptText) {
    payload.prompt = promptText;
  }

  const response = await fetch(`${API_BASE}/app/comp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
  alternatives?: string | string[];
  valueFocus?: string;
  prompt?: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const alternativeList = normalizeTextList(alternatives);

  const sanitizedIndustry = sanitizeText(industry);
  const sanitizedCustomer = sanitizeText(customer);

  if (!sanitizedIndustry) {
    throw new Error("Industry is required.");
  }

  if (!sanitizedCustomer) {
    throw new Error("Customer is required.");
  }

  const payload: Record<string, unknown> = {
    industry: sanitizedIndustry,
    customer: sanitizedCustomer,
  };

  if (alternativeList.length > 0) {
    payload.alternatives = alternativeList;
  }

  const valueFocusText = sanitizeText(valueFocus);
  if (valueFocusText) {
    payload.valueFocus = valueFocusText;
  }

  const promptText = sanitizeText(prompt);
  if (promptText) {
    payload.prompt = promptText;
  }

  const response = await fetch(`${API_BASE}/app/blueocean`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
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
