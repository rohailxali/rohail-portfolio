/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
    },
    reactStrictMode: true,
    poweredByHeader: false,
};

export default nextConfig;
