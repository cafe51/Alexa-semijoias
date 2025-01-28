import { Metadata } from 'next';
import HomeContent from './components/homePage/HomeContent';

export const metadata: Metadata = {
    title: 'Alexa Semijoias | Semijoias Exclusivas com Elegância e Qualidade',
    description: 'Descubra nossa coleção exclusiva de semijoias. Brincos, colares, anéis e pulseiras com qualidade premium. Compre em até 6x sem juros com entrega para todo Brasil.',
    keywords: 'semijoias, joias, acessórios, brincos, colares, anéis, pulseiras, folheados, ouro, prata, joias em aço',
    openGraph: {
        title: 'Alexa Semijoias | Semijoias Exclusivas',
        description: 'Descubra nossa coleção exclusiva de semijoias. Peças únicas com qualidade e elegância.',
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

export default function HomePage() {
    return <HomeContent />;
}
