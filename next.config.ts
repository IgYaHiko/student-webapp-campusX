import type { NextConfig } from "next";

const isCloudflareBuild = process.env.BUILD_TARGET === "cloudflare";

const nextConfig: NextConfig = {
  ...(isCloudflareBuild ? {} : { output: "standalone" as const }),

  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
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
