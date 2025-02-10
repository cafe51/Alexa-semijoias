// src/app/components/homePage/HomeContent.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { FireBaseDocument, ProductBundleType, SectionType } from '@/app/utils/types';
import HeroSection from './HeroSection';
import InfoBanner from './InfoBanner';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { fetchRandomProductForSection } from '@/app/services/products';
import { serializeData } from '@/app/utils/serializeData';

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
                    <div key={ `skeleton-${index}` } className="aspect-square bg-skeleton animate-pulse rounded" />
                )) }
            </div>
        </div>
    );
}

// Função para buscar as seções (única chamada)
async function getSections() {
    try {
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        return sectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...serializeData(doc.data()),
        })) as (SectionType & FireBaseDocument)[];
    } catch (error) {
        console.error('Erro ao buscar seções:', error);
        return [];
    }
}

// Agora a função recebe as seções já carregadas (evitando duplicação)
async function getFeaturedProducts(sectionsData: (SectionType & FireBaseDocument)[]) {
    try {
        const productsPromises = sectionsData.map(async(section) => {
            const productsRef = collection(projectFirestoreDataBase, 'products');
            const q = query(
                productsRef,
                where('estoqueTotal', '>=', 1),
                where('showProduct', '==', true),
                where('sections', 'array-contains', section.sectionName),
                orderBy('creationDate', 'desc'),
                limit(1),
            );
            const productsSnapshot = await getDocs(q);
            const doc = productsSnapshot.docs[0];
            if (!doc) return null;
            return {
                id: doc.id,
                ...serializeData(doc.data()),
            } as (ProductBundleType & FireBaseDocument);
        });
        const products = await Promise.all(productsPromises);
        return products.filter((product): product is ProductBundleType & FireBaseDocument => product !== null);
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return [];
    }
}

// Para cada seção, busca um produto aleatório para o carousel
async function getRandomProductsForSections(
    sections: (SectionType & FireBaseDocument)[],
) {
    const randomProducts = await Promise.all(
        sections.map(async(section) => {
            const product = await fetchRandomProductForSection(section.sectionName);
            return { section: section.sectionName, product };
        }),
    );
    return randomProducts;
}
  
// Cache (revalidate) – os dados serão revalidado a cada 60 segundos
export const revalidate = 60;
  
export default async function HomeContent() {
    // Busca as seções primeiro
    const sections = await getSections();
  
    // Busca os produtos aleatórios para cada seção (para o carousel)
    const randomProductsForSections = await getRandomProductsForSections(sections);
  
    // Busca os produtos em destaque (para outra parte da página)
    const featuredProducts = await getFeaturedProducts(sections);
  
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroSection />
            <InfoBanner />
            <Suspense fallback={ <LoadingFallback /> }>
                <SectionsCarousel sections={ randomProductsForSections } />
            </Suspense>
            <Suspense fallback={ <LoadingFallback /> }>
                <FeaturedProducts featuredProducts={ featuredProducts } />
            </Suspense>
        </div>
    );
}