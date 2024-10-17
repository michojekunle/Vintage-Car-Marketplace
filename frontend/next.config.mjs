/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: "gateway.pinata.cloud",
          },
        ],
      },
    },
};

export default nextConfig;
