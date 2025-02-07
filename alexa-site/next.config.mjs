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
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9199',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '9199',
                pathname: '/**',
            },
        ],
    },
    async redirects() {
        return [
            {
            // Redireciona requisições feitas para a versão non-www para a versão www.
            // Quando o host for "alexasemijoias.com.br", redireciona para "https://www.alexasemijoias.com.br"
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'alexasemijoias.com.br',
                    },
                ],
                destination: 'https://www.alexasemijoias.com.br/:path*',
                permanent: true,
            },
            {
            // Redireciona "/index.html" para "/"
                source: '/index.html',
                destination: '/',
                permanent: true,
            },
            {
            // Redireciona "/index.php" para "/"
                source: '/index.php',
                destination: '/',
                permanent: true,
            },
        ];
    },
    
};

export default nextConfig;
