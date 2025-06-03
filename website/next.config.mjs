/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // images: {
  //   domains: ['frequencyimage.s3.ap-south-1.amazonaws.com', 'images.pexels.com'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'frequencyimage.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'loopwebsite.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
