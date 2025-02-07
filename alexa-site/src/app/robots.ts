// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/login/',
                '/cadastro/',
                '/minha-conta/',
                '/recuperar-senha/',
            ],
        },
        sitemap: 'https://www.alexasemijoias.com.br/sitemap.xml',
        host: 'https://www.alexasemijoias.com.br',
    };
}
