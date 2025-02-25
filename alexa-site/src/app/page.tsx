// src/app/page.tsx
import { Metadata } from 'next';
import HomeContent from './components/homePage/HomeContent';

export const metadata: Metadata = {
    title: 'Alexa Semijoias | Semijoias de Verdade',
    description:
    'Descubra Alexa Semijoias. Semijoias com banho de 10 milésimos de ouro 18k. Joias em aço. Entrega para todo o brasil. Seja uma revendedora Alexa.', 
    keywords: [
        'semijoias',
        'joias',
        'acessórios',
        'brincos',
        'colares',
        'anéis',
        'pulseiras',
        'folheados',
        'ouro',
        'prata',
        'joias em aço',
    ],
    alternates: {
        canonical: 'https://www.alexasemijoias.com.br',
    },
    openGraph: {
        title: 'Alexa Semijoias | Semijoias de Verdade',
        description: 'Descubra Alexa Semijoias. Semijoias de Verdade.',
        url: 'https://www.alexasemijoias.com.br',
        siteName: 'Alexa Semijoias',
        type: 'website',
        images: [
            {
                url: '/bigHeroLogo.png',
                width: 800,
                height: 600,
                alt: 'Alexa Semijoias Logo',
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
    },
};

export default async function HomePage() {
    return await HomeContent();
}
