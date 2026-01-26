import Image from "next/image";
import Navbar from "@/components/Navbar";
import Section from "@/components/Section";
import HowItWorks from "@/components/HowItWorks";
import Frameworks from "@/components/Frameworks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "#";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Section className="!py-4 sm:!py-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Left column: text */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Competitive intelligence, ready in minutes.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Understand competitors, identify strategic gaps, and generate executive-ready decisions and decks — powered by AI.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="/tryapp"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700"
              >
                Run Competitive Analysis
              </a>
              <a href="https://th6l1p45uevhzgdg.public.blob.vercel-storage.com/GoodBlue_Competitive%20Analysis_Sample_Deck.pdf" className="text-blue-700 font-medium hover:underline">
                View Sample Competitive Report
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Powered by proven strategy methods (competitive SWOT, benchmarking, market intelligence).
            </p>
          </div>

          {/* Right column: image */}
          <div className="flex justify-center">
            <Image
              src="/StrategyDashboard.png"
              alt="GoodBlue strategy"
              width={500}
              height={400}
              className="rounded-xl shadow-md border border-blue-100"
              priority
            />
          </div>
        </div>
      </Section>

      <HowItWorks />
      <CTASection />
      <Footer />
    </>
  );
}
