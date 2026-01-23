import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Frameworks from "@/components/Frameworks";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar showCTA />

      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">How GoodBlue Works</h1>

        <p className="text-lg text-gray-600 mb-10">
          GoodBlue performs competitive analysis by automatically applying
          proven strategy frameworks where they add the most value.
        </p>

        {/* Frameworks live here now */}
        <Frameworks />
      </main>

      <Footer />
    </div>
  );
}
>>>>>>> feature/companalysis
