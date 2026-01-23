import Section from "./Section";
import Link from "next/link";

const frameworks = [
  { name: "SWOT Analysis", path: "/swot" },
  { name: "Ansoff Matrix", path: "/ansoff" },
  { name: "TAM / SAM / SOM", path: "/tam" },
  { name: "Porter's 5 forces", path: "/porters" },
  { name: "Mekko Market Analysis", path: "/mekko" },
  { name: "Competitive Analysis", path: "/comp" },
  { name: "Blue Ocean Canvas", path: "/blueocean" },
  { name: "5-Box Strategy Grid", path: "/5box" },
];

export default function Frameworks() {
  return (
    <Section id="frameworks">
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
