"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Section from "./Section";

const items = [
  { title: "Select Market & Competitors", desc: "(Company, competitors, market, product line)", src: "/pptChecklist.png" },
  { title: "Ingest Market Signals", desc: "(Market data, product info, notes, documents, insights)", src: "/pptUpload.png" },
  { title: "Generate Competitive Intelligence", desc: "(Positioning, gaps, threats, opportunities, benchmarks)", src: "/pptInsights.png" },
  { title: "Export Strategy Outputs", desc: "(Board decks, exec briefs, strategy docs)", src: "/pptSlides.png" },
];

export default function HowItWorks() {
  return (
    <Section id="how"className="!py-4 sm:!py-8">
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
