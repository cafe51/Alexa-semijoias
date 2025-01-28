// src/app/layout.tsx

import { Montserrat } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Header from './components/header/Header';
import { AuthContextProvider } from './context/AuthContext';
import { UserInfoProvider } from './context/UserInfoContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { Metadata } from 'next';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://www.alexasemijoias.com.br'),
    title: {
        template: '%s | Alexa Semijoias',
        default: 'Alexa Semijoias | Semijoias Exclusivas',
    },
    description: 'Descubra nossa coleção exclusiva de semijoias. Peças únicas com qualidade e elegância para todos os momentos.',
    keywords: ['semijoias', 'joias', 'acessórios', 'moda', 'elegância', 'presentes', 'joias em aço', 'joias folheadas', 'brincos', 'pulseiras', 'colares', 'anéis', 'ofertas', 'presentes', 'brincos', 'colares', 'anéis', 'pulseiras', 'folheados', 'ouro', 'prata', 'rodio'],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://www.alexasemijoias.com.br',
        siteName: 'Alexa Semijoias',
        title: 'Alexa Semijoias | Semijoias Exclusivas',
        description: 'Descubra nossa coleção exclusiva de semijoias. Peças únicas com qualidade e elegância para todos os momentos.',
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
        title: 'Alexa Semijoias | Semijoias Exclusivas',
        description: 'Descubra nossa coleção exclusiva de semijoias. Peças únicas com qualidade e elegância para todos os momentos.',
        images: ['/bigHeroLogo.png'],
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

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="theme-color" content="#FAF9F6" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={ `${inter.className} min-h-screen bg-[#FAF9F6]` }>
                <Script
                    id="fb-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={ {
                        __html: `
            window.fbqLoaded = window.fbqLoaded || false;
            if (!window.fbqLoaded) {
                window.fbqLoaded = true;
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '574789162040735');
                fbq('track', 'PageView');
            }
        `,
                    } }
                />
                <noscript>
                    <img 
                        height="1" 
                        width="1" 
                        style={ { display: 'none' } }
                        src="https://www.facebook.com/tr?id=574789162040735&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header />
                        { children }
                        <Footer />
                    </UserInfoProvider>
                </AuthContextProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
