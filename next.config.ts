import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  async redirects() {
    // Old Reach Out addresses now live inside PULSE: FIRST LOOK.
    return [
      { source: "/reach-out", destination: "/start", permanent: false },
      { source: "/admin", destination: "/review", permanent: false },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
