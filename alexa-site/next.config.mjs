/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.dooca.store',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
