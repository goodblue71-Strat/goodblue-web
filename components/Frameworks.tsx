import Section from "./Section";
import Link from "next/link";

const frameworks = [
  { name: "SWOT Analysis", path: "/swot" },
  { name: "Ansoff Matrix", path: "/ansoff" },
  { name: "TAM / SAM / SOM", path: "/tam" },
  { name: "Porter's 5 forces", path: "/porters" },
  { name: "Mekko Market Analysis", path: "/mekko" },
  { name: "Competitive Analysis", path: "/notready" },
  { name: "Blue Ocean Canvas", path: "/notready" },
  { name: "5-box Strategy", path: "/notready" },
];

export default function Frameworks() {
  return (
    <Section id="frameworks">
      <h2 className="text-2xl font-semibold">Frameworks You Know, Faster Than Ever</h2>
      <p className="text-gray-600 mt-2">Choose classic strategy lenses—combine multiple in one run.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {frameworks.map((f) => (
          <Link
            key={f.name}
            href={f.path}
            className="rounded-xl bg-white p-4 text-center text-sm font-medium text-gray-800 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
          >
            {f.name}
          </Link>
        ))}
      </div>
    </Section>
  );
}
