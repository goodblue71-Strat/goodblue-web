"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Section from "./Section";

const items = [
  { title: "Select Framework", desc: "SWOT, Ansoff-TAM", src: "/pptChecklist.png" },
  { title: "Upload Data", desc: "Market, Product or Notes", src: "/pptUpload.png" },
  { title: "Generate Insights", desc: "AI analyzes & visualizes", src: "/pptInsights.png" },
  { title: "Export Decks", desc: "Ready-to-share slides", src: "/pptSlides.png" },
];

export default function HowItWorks() {
  return (
    <Section id="how">
      <h2 className="text-2xl font-semibold mb-6 text-center">How it Works</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Icon as image */}
            <motion.div
              whileHover={{ scale: 1.12, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="relative mb-4 h-24 w-24 rounded-2xl bg-blue-50 shadow-inner flex items-center justify-center"
            >
              <Image
                src={it.src}
                alt={it.title}
                fill
                className="object-contain p-3"
                sizes="96px"
                priority={i === 0}
              />
            </motion.div>

            <div className="font-medium text-lg">{it.title}</div>
            <div className="text-sm text-gray-600 mt-1">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
