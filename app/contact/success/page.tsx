import Link from "next/link";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies, headers } from "next/headers"; // not needed for this, but okay
import { Suspense } from "react";
import { useSearchParams } from "next/navigation"; // only for client components
import type { Metadata } from "next";

export const metadata = {
  title: "Thanks — GoodBlue",
  description: "We received your message.",
  robots: { index: false }, // optional: don’t index a transient page
};


export default function ContactSuccessPage({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams?.name ?? "";
  return (
    <>
      <Navbar />
      <Section narrow className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Thank you!</h1>
        <p className="mt-3 text-gray-600">
           {name ? `Thanks, ${name}! ` : "Thank you!"} Your message has been sent.
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
