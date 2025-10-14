import Link from "next/link";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Thanks — GoodBlue",
  description: "We received your message.",
  robots: { index: false }, // optional: don’t index a transient page
};

export default function ContactSuccessPage() {
  return (
    <>
      <Navbar />
      <Section narrow className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Thank you!</h1>
        <p className="mt-3 text-gray-600">
          Your message has been sent. We’ll get back to you shortly.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </Section>
      <Footer />
    </>
  );
}
