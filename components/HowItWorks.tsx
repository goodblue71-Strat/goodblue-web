import Section from "./Section";

const items = [
  { title: "Select Framework", desc: "SWOT, Ansoff-TAM", icon: "◆" },
  { title: "Upload Data", desc: "Market, Product or Notes", icon: "▮" },
  { title: "Generate Insights", desc: "AI analyzes & visualizes", icon: "◔" },
  { title: "Export Decks", desc: "Ready-to-share slides", icon: "➜" },
];

export default function HowItWorks() {
  return (
    <Section id="how">
      <h2 className="text-2xl font-semibold mb-6">How it Works</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <span className="text-blue-700">{it.icon}</span>
            </div>
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600 mt-1">{it.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
