import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

export const metadata = {
  title: "Terms of Service — GoodBlue",
  description: "GoodBlue.ai Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <Section narrow>
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-700 mb-4">
          Welcome to GoodBlue.ai. By accessing or using our website and related
          services (“Services”), you agree to these Terms of Service. If you do
          not agree, please do not use our site.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Services</h2>
        <p className="text-gray-700 mb-4">
          You may use our Services only for lawful purposes. You agree not to
          misuse or attempt to disrupt the functionality of our website or
          related systems.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content, features, and functionality on GoodBlue.ai—including
          text, graphics, logos, and code—are owned by GoodBlue.ai and are
          protected by applicable intellectual property laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Disclaimer</h2>
        <p className="text-gray-700 mb-4">
          The Services are provided “as is” without warranties of any kind.
          GoodBlue.ai makes no guarantees regarding accuracy, availability, or
          reliability of content or insights generated through the site.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          To the maximum extent permitted by law, GoodBlue.ai shall not be
          liable for any indirect, incidental, or consequential damages arising
          out of your use or inability to use the Services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          We may update these Terms from time to time. Continued use of our
          Services after updates means you accept the new terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
        <p className="text-gray-700">
          For questions about these Terms, contact us at{" "}
          <a
            href="mailto:hello@gooblue.ai"
            className="text-blue-600 hover:underline"
          >
            hello@gooblue.ai
          </a>.
        </p>
      </Section>
      <Footer />
    </>
  );
}
