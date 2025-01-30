import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { FireBaseDocument, ProductBundleType, SectionType } from '@/app/utils/types';
import HeroSection from './HeroSection';
import InfoBanner from './InfoBanner';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';

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

// Funções para buscar dados diretamente do Firestore
async function getSections() {
    try {
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        return sectionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as (SectionType & FireBaseDocument)[];
    } catch (error) {
        console.error('Erro ao buscar seções:', error);
        return [];
    }
}

async function getFeaturedProducts() {
    try {
        // Primeiro, buscar todas as seções
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        const sections = sectionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as (SectionType & FireBaseDocument)[];

        // Buscar produtos em destaque para cada seção em paralelo
        const productsPromises = sections.map(async(section) => {
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
                ...doc.data(),
            } as (ProductBundleType & FireBaseDocument);
        });

        const products = await Promise.all(productsPromises);
        return products.filter((product): product is ProductBundleType & FireBaseDocument => product !== null);
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return [];
    }
}

// Componentes de renderização
function Sections({ sections }: { sections: SectionType[] }) {
    return <SectionsCarousel sections={ sections.map(section => section.sectionName) } />;
}

function Products({ products }: { products: (ProductBundleType & FireBaseDocument)[] }) {
    return <FeaturedProducts featuredProducts={ products } />;
}

export default async function HomeContent() {
    const sections = await getSections();
    const products = await getFeaturedProducts();

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
