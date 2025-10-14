import ContactForm from "@/components/ContactForm";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <Section narrow>
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Get in touch
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          We’d love to hear your feedback or help you with any questions.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </Section>

      <Footer />
    </>
  );
}
