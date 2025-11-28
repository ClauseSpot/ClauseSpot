/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true, // opcional para evitar erros TS quebrando deploy
  },
};

module.exports = nextConfig;
