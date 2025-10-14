import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export default function ContactSection() {
  return (
    <Section id="contact" className="text-center" narrow>
      <h2 className="text-2xl sm:text-3xl font-semibold">Contact</h2>
      <p className="mt-2 text-gray-600">
        Send feedback or request a demo — we’ll reply by email.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </Section>
  );
}
