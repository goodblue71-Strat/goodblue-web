import Link from "next/link";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies, headers } from "next/headers"; // not needed for this, but okay
import { Suspense } from "react";
import { useSearchParams } from "next/navigation"; // only for client components
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ name?: string }>;
}

export const metadata = {
  title: "Thanks — GoodBlue",
  description: "We received your message.",
  robots: { index: false }, // optional: don’t index a transient page
};

export default async function ContactSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name || 'there';


export default async function ContactSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name || 'there';
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You, {name}!</h1>
        <p className="text-lg mb-8">
          We've received your message and will get back to you soon.
        </p>
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
