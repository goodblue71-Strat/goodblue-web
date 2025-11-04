import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

export const metadata = {
  title: "Frameworks - Goodblue",
  description: "This framework is being developed and is coming soon.",
};

export default function FrameworksPage() {
  return (
    <>
      <Navbar />
      <Section narrow className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Frameworks</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Our strategic frameworks are currently in development and will be available soon.
          We are building powerful tools to help you analyze and plan your business strategy.
        </p>
        <p className="mt-10 text-gray-500 text-sm">
          Stay tuned for comprehensive frameworks including SWOT analysis, business model canvas, and more strategic planning tools.
        </p>
      </Section>
      <Footer />
    </>
  );
}
