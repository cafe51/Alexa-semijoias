// HomeContent.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SectionType } from '@/app/utils/types';
import HeroSection from './HeroSection';
import InfoBanner from './InfoBanner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const SectionsCarousel = dynamic(() => import('./SectionsCarousel'), {
    ssr: true,
});

const FeaturedProducts = dynamic(() => import('./FeaturedProducts'), {
    ssr: true,
});

function LoadingFallback() {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                { Array.from({ length: 3 }).map((_, index) => (
                    <div 
                        key={ `skeleton-${index}` } 
                        className="aspect-square bg-skeleton animate-pulse rounded" 
                    />
                )) }
            </div>
        </div>
    );
}

// Componentes para buscar dados
const SectionsDataFetcher = async() => {
    const response = await fetch(`${API_BASE_URL}/api/sections`, { 
        next: { revalidate: 60 },
    });
    const sections = await response.json();
    return sections;
};

const ProductsDataFetcher = async() => {
    const response = await fetch(`${API_BASE_URL}/api/featured-products`, {
        next: { revalidate: 60 },
    });
    return response.json();
};

// Componentes de renderização
function Sections({ sections }: { sections: SectionType[] }) {
    return <SectionsCarousel sections={ sections.map(section => section.sectionName) } />;
}

function Products({ products }: { products: any[] }) {
    return <FeaturedProducts featuredProducts={ products } />;
}

export default async function HomeContent() {
    const sections = await SectionsDataFetcher();
    const products = await ProductsDataFetcher();

    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroSection />
            <InfoBanner />
            <Suspense fallback={ <LoadingFallback /> }>
                <Sections sections={ sections } />
            </Suspense>
            <Suspense fallback={ <LoadingFallback /> }>
                <Products products={ products } />
            </Suspense>
        </div>
    );
}