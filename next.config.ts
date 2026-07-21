import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.0.110", "10.148.39.53"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
