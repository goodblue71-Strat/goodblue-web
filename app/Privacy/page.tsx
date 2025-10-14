import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

export const metadata = {
  title: "Privacy Policy — GoodBlue",
  description: "GoodBlue.ai Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <Section narrow>
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          GoodBlue.ai does not collect or store any personal information from visitors.
          Any information you share through our contact form is used solely to respond
          to your inquiry and is not shared with third parties.
        </p>
        <p className="text-gray-700">
          We may update this policy from time to time. Continued use of this site
          implies acceptance of the current version.
        </p>
      </Section>
      <Footer />
    </>
  );
}
