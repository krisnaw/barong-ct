import type {NextConfig} from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    remotePatterns: [new URL('https://www.mainsepeda.com/**')],
  },
  allowedDevOrigins: ['*.faef4b1426d4d1.lhr.life']
};

export default nextConfig;
