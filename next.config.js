/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Only the /embed/* routes can be iframed
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Allow local Streamlit and your deployed Streamlit origin to embed this page
            value: [
              "frame-ancestors",
              "'self'",
              "http://localhost:8501",          // Streamlit local
              "http://localhost:3000",          // (optional) if you embed Next locally
              "https://YOUR-STREAMLIT-DOMAIN",  // <-- replace with prod Streamlit URL
            ].join(" "),
          },
          // If your platform injects X-Frame-Options=DENY, override/remove for this path:
          // { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cache-Control", value: "public, max-age=60" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
