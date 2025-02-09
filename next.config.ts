import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      '127.0.0.1', // For local development
      'localhost',  // Also for local development
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', ''), // Production Supabase URL
    ].filter(Boolean) as string[], // Remove any undefined values
  },

};

export default nextConfig;
