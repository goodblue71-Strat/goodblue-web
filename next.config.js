/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // ✅ List *origins* only (no trailing slash), each separated by spaces
            value: [
              "frame-ancestors",
              "'self'",
              "http://localhost:8501", // Streamlit local
              // keep localhost:3000 only if you embed Next -> Next during dev
              //"http://localhost:3000",
              "https://goodblue-backend-production.up.railway.app", // ✅ your Streamlit prod origin (no trailing slash)
            ].join(" "),
          },
          // Optional: if something injects X-Frame-Options=DENY by default, override/remove for /embed/*
          // { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cache-Control", value: "public, max-age=60" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
