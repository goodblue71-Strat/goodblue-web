// app/embed/navbar/page.tsx
// If your Navbar uses hooks or client-only logic, add "use client" at the top.
import Navbar from "@/components/Navbar"; // <-- adjust if your Navbar lives elsewhere

export const revalidate = 60; // optional caching

export default function EmbedNavbar() {
  return (
    <header style={{ width: "100%", border: 0 }}>
      <Navbar />
    </header>
  );
}
