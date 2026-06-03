import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators:false,
  // typescript:{
  //   ignoreBuildErrors:true
  // },
serverExternalPackages: ['@prisma/client'],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false
      }
    ]
  }
};

export default nextConfig;
