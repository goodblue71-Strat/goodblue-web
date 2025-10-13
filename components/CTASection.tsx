import Section from "./Section";

export default function CTASection() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";
  return (
    <Section className="text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold">Ready to build your next strategy?</h2>
      <p className="text-gray-600 mt-2">GoodBlue helps teams move from data → decision → deck.</p>
      <div className="mt-6">
        <a
          href={appUrl}
          target="_blank" rel="noopener noreferrer"
          className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700"
        >
          Try the App
        </a>
      </div>
    </Section>
  );
}
