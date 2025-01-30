import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SectionType } from '@/app/utils/types';
import HeroSection from './HeroSection';
import InfoBanner from './InfoBanner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Importação dinâmica dos componentes que precisam de client-side
const SectionsCarousel = dynamic(() => import('./SectionsCarousel'), {
    ssr: true,
});

const FeaturedProducts = dynamic(() => import('./FeaturedProducts'), {
    ssr: true,
});

// Componente para carregamento
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

// Componentes Server para dados
async function SectionsData() {
    const response = await fetch(`${API_BASE_URL}/api/sections`, { 
        next: { revalidate: 60 }, // Revalidar a cada minuto
    });
    const sections = await response.json();
    return <SectionsCarousel sections={ sections.map((section: SectionType) => section.sectionName) } />;
}

async function ProductsData() {
    const response = await fetch(`${API_BASE_URL}/api/featured-products`, {
        next: { revalidate: 60 }, // Revalidar a cada minuto
    });
    const products = await response.json();
    return <FeaturedProducts featuredProducts={ products } />;
}

export default function HomeContent() {
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroSection />
            <InfoBanner />
            <Suspense fallback={ <LoadingFallback /> }>
                <SectionsData />
            </Suspense>
            <Suspense fallback={ <LoadingFallback /> }>
                <ProductsData />
            </Suspense>
        </div>
    );
}
