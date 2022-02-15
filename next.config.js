/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.themoviedb.org', 'www.gravatar.com'],
  },
};

module.exports = nextConfig;
