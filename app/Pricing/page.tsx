import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

export const metadata = {
  title: "Pricing — GoodBlue",
  description: "GoodBlue.ai is free for now — pricing plans coming soon.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Section narrow className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Pricing</h1>
        <p className="text-gray-600 mb-8 text-lg">
          GoodBlue is <strong>free for now</strong> while we’re in early access.
          We’re building new features and plan to introduce fair pricing tiers
          for individuals, teams, and enterprises soon.
        </p>
        <p className="mt-10 text-gray-500 text-sm">
          Future pricing will include flexible plans for personal, professional,
          and enterprise use — with generous free access for early users.
        </p>
      </Section>
      <Footer />
    </>
  );
}
