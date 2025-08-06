const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: require('next-pwa/cache'),
});

module.exports = withPWA({
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
  // Configure images for production
  images: {
    unoptimized: true,
    domains: ['localhost', 'station-bites.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'station-bites.vercel.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/uploads/**',
      },
    ],
  },
  // Configure static file serving
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
  // Add trailing slash for better compatibility
  trailingSlash: false,
  // Enable static exports if needed
  output: 'standalone',
});
