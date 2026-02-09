import type {NextConfig} from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placeholdit.com",
      },
    ],
  },
  allowedDevOrigins: ['*.6c8a276422641d.lhr.life']
};

export default nextConfig;
