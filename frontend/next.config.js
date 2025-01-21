/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Vary",
            value: "Sec-CH-Prefers-Color-Scheme",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud-test.zhenghao-zhao.workers.dev",
      },
      {
        protocol: "https",
        hostname: "pub-4533b9aa90cd45179e8d6c3683151f32.r2.dev",
      },
    ],
  },
};

module.exports = nextConfig;
