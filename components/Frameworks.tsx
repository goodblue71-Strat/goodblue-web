import Section from "./Section";

const frameworks = [
  "SWOT Analysis",
  "Ansoff Matrix",
  "TAM / SAM / SOM",
  "Roadmap",
  "Benchmarking",
  "5 Forces",
  "KPI Tree",
  "Scenario",
];

export default function Frameworks() {
  return (
    <Section id="frameworks">
      <h2 className="text-2xl font-semibold">Frameworks You Know, Faster Than Ever</h2>
      <p className="text-gray-600 mt-2">Choose classic strategy lenses—combine multiple in one run.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {frameworks.map((f) => (
          <div key={f} className="rounded-xl bg-white p-4 text-center text-sm font-medium text-gray-800 shadow-sm border border-gray-200">
            {f}
          </div>
        ))}
      </div>
    </Section>
  );
}
