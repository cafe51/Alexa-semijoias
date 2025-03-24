// src/app/page.tsx
import { Metadata } from 'next';
import HomeContent from './components/homePage/HomeContent';
import { getLastProductAdded } from './components/homePage/homePageUtilFunctions';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const lastAddProduct = await getLastProductAdded();
        return {
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
                images: lastAddProduct ? lastAddProduct.images.map((img) => {
                    return (
                        {
                            url: img.localUrl,
                            width: 800,
                            height: 600,
                            alt: 'Alexa Semijoias Logo',
                        }
                    );
                }) : [{
                    url: '/bigHeroLogo.png',
                    width: 800,
                    height: 600,
                    alt: 'Alexa Semijoias Logo',
                }],
                
            },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        };
    } catch (error) {
        console.log('Erro ao gerar metadata:', error);
        return {
            title: 'Alexa Semijoias',
            description: 'Descubra nossa coleção exclusiva de semijoias.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

export default async function HomePage() {
    return await HomeContent();
}
