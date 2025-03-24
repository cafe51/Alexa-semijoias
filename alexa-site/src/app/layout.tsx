// src/app/layout.tsx
import { Montserrat } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer/Footer';
import Header from './components/header/Header';
import { AuthContextProvider } from './context/AuthContext';
import { UserInfoProvider } from './context/UserInfoContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { WebVitals } from './components/WebVitals';
import { Metadata } from 'next';
import FacebookPixel from './components/FacebookPixel';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { getSiteSections } from './services/siteSections';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://www.alexasemijoias.com.br'),
    title: {
        template: '%s | Alexa Semijoias',
        default: 'Alexa Semijoias | Semijoias de Verdade',
    },
    description: 'Descubra Alexa Semijoias. Semijoias de Verdade',
    keywords: [
        'semijoias',
        'joias',
        'acessórios',
        'moda',
        'elegância',
        'presentes',
        'joias em aço',
        'joias folheadas',
        'brincos',
        'pulseiras',
        'colares',
        'anéis',
        'ofertas',
        'folheados',
        'ouro',
        'prata',
        'rodio',
    ],
    alternates: {
        canonical: 'https://www.alexasemijoias.com.br',
        languages: {
            'pt-BR': 'https://www.alexasemijoias.com.br',
            'en-US': 'https://www.alexasemijoias.com.br/en',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://www.alexasemijoias.com.br',
        siteName: 'Alexa Semijoias',
        title: 'Alexa Semijoias | Semijoias de Verdade',
        description: 'Descubra Alexa Semijoias. Semijoias de Verdade',
        images: [
            {
                url: '/bigHeroLogo.png',
                width: 800,
                height: 600,
                alt: 'Alexa Semijoias Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alexa Semijoias | Semijoias de Verdade',
        description: 'Descubra Alexa Semijoias. Semijoias de Verdade',
        images: ['/MetadataBanner.png'],
        creator: '@alexasemijoias',
        site: '@alexasemijoias',
    },
    verification: {
        google: 'adicione-sua-verificacao-google',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    authors: [{ name: 'Alexa Semijoias' }],
    category: 'E-commerce',
    other: {
        'msapplication-TileColor': '#FAF9F6',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'Alexa Semijoias',
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const menuSections = await getSiteSections();

    return (
        <html lang="pt-BR" className={ `${montserrat.className} scroll-smooth` } style={ { scrollBehavior: 'auto' } }>
            <head>
                { /* As meta tags serão injetadas automaticamente com a API de metadata do Next.js */ }
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="theme-color" content="#FAF9F6" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
                <link rel="icon" href="/favicon.ico" />
                
                { /* Script para garantir que a página sempre comece no topo */ }
                <script
                    dangerouslySetInnerHTML={ {
                        __html: `
                            if (typeof window !== 'undefined') {
                                window.history.scrollRestoration = 'manual';
                                window.onload = function() {
                                    window.scrollTo(0, 0);
                                }
                            }
                        `,
                    } }
                />

                { /* JSON‑LD: Structured Data para Organization */ }
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={ {
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Alexa Semijoias',
                            url: 'https://www.alexasemijoias.com.br',
                            logo: 'https://www.alexasemijoias.com.br/bigHeroLogo.png',
                            sameAs: [
                                'https://www.facebook.com/alexasemijoias',
                                'https://www.instagram.com/alexa.semijoias',
                            ],
                        }),
                    } }
                />

                { /* JSON‑LD: Structured Data para Website com SearchAction */ }
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={ {
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            url: 'https://www.alexasemijoias.com.br',
                            name: 'Alexa Semijoias',
                            potentialAction: {
                                '@type': 'SearchAction',
                                target:
                  'https://www.alexasemijoias.com.br/search/search_term_string',
                                'query-input': 'required name=search_term_string',
                            },
                        }),
                    } }
                />
            </head>
            <body className="min-h-screen bg-[#FAF9F6] text-[#333333]">
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header initialMenuSections={ menuSections } />
                        { children }
                        <Footer sections={ menuSections } />
                    </UserInfoProvider>
                </AuthContextProvider>

                <GoogleTagManager gtmId="GTM-K3CB5QZM" />
                <GoogleAnalytics gaId="G-KLLD2T3EQ1" />
                <Analytics />
                <SpeedInsights />
                <WebVitals />
                <FacebookPixel />
            </body>
        </html>
    );
}
