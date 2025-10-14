"use client";
import { motion } from "framer-motion";
import Section from "./Section";

const items = [
  { title: "Select Framework", desc: "SWOT, Ansoff-TAM", icon: "◆" },
  { title: "Upload Data", desc: "Market, Product or Notes", icon: "▮" },
  { title: "Generate Insights", desc: "AI analyzes & visualizes", icon: "◔" },
  { title: "Export Decks", desc: "Ready-to-share slides", icon: "➜" },
];

export default function HowItWorks() {
  return (
    <Section id="how">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        How it Works
      </h2>

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
            {/* Animated icon */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center justify-center h-24 w-24 rounded-2xl bg-blue-100 mb-4 shadow-inner"
            >
              <span className="text-5xl text-blue-700">{it.icon}</span>
            </motion.div>

            <div className="font-medium text-lg">{it.title}</div>
            <div className="text-sm text-gray-600 mt-1">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
