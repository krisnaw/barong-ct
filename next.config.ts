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
  allowedDevOrigins: ['*.faef4b1426d4d1.lhr.life']
};

export default nextConfig;
