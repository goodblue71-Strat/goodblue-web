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
      <Section className="pt-4">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Left column: text */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Strategy, generated—board-ready in minutes.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Turn market inputs into insights and slides powered by AI and proven strategy frames.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700"
              >
                Try the App
              </a>
              <a href="#sample" className="text-blue-700 font-medium hover:underline">
                View Sample Deck
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              GoodBlue is free during our early access phase. Paid plans coming soon.
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
      <Frameworks />
      <CTASection />
      <Footer />
    </>
  );
}
