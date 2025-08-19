/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // webpack 설정 초기화
  webpack: (config, { isServer }) => {
    // 캐시 문제 해결
    config.cache = false;
    return config;
  }
}

module.exports = nextConfig