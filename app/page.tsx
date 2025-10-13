import Image from "next/image";

export default function Home() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://goodblue-app-yourname.streamlit.app";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 p-8">
    <div className="text-red-600">
      <h1 className="!text-red-600 text-5xl font-bold">
        Strategy, generated—board-ready in minutes.
      </h1>
    </div>
      <p className="text-lg text-gray-600 max-w-lg">
        Pick a company and product. Get SWOT, benchmarks, and a PPT you can present today.
      </p>

      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Try the App
      </a>
    </main>
  );
}
