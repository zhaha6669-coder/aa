/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Enable experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', '@react-three/fiber', '@react-three/drei'],
  },
};

export default nextConfig;
