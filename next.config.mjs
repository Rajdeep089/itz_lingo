/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com','img.freepik.com', "itzlingo.s3.amazonaws.com"],
  },
};

export default nextConfig;
