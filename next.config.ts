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
  allowedDevOrigins: ['*.5734050f10fe38.lhr.life']
};

export default nextConfig;
