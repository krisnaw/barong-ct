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
  allowedDevOrigins: ['*.d79698cb9164a0.lhr.life']
};

export default nextConfig;
