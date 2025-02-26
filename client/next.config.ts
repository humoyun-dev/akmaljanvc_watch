import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    // API: "https://api.svetafor.uz/platform/",
    API: "http://127.0.0.1:8000/",
    TELEGRAM_BOT_TOKEN: "7665107522:AAHGgIDELWhYWBsWTaZmwi57LpOXuTX8FsA",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
};

export default nextConfig;
