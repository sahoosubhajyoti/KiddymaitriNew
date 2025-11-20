import type { NextConfig } from "next";

// Import and create the NextIntl plugin
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  // Optional: Add other production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Optional: Enable if you want to use static exports
  // output: 'export',
  
  // Optional: Configure images if needed
  images: {
    domains: ['your-domain.com'], // Add your image domains here
  },
  
  // Optional: Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

// Export the config wrapped with NextIntl plugin
export default withNextIntl(nextConfig);