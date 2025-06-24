/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Proxy API requests starting with /api/
        destination: "http://localhost:5000/api/:path*", // Forward them to Express server
      },
    ];
  },
};

export default nextConfig;
