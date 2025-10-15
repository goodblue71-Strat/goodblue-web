// app/embed/footer/page.tsx
// If your Footer uses hooks or client-only logic, add "use client" at the top.
import Footer from "@/components/Footer"; 

export const revalidate = 60; // optional caching

export default function EmbedFooter() {
  return (
    <header style={{ width: "100%", border: 0 }}>
      <Footer />
    </header>
  );
}
