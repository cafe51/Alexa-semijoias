'use client';

import { useEffect, useState } from 'react';
import SectionsCarousel from './SectionsCarousel';
import FeaturedProducts from './FeaturedProducts';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, OrderByOption, ProductBundleType, SectionType } from '@/app/utils/types';
import InfoBanner from './InfoBanner';
import HeroSection from './HeroSection';

export default function HomeContent() {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');
    const { getAllDocuments: getAllProducts } = useCollection<ProductBundleType>('products');

    const [sections, setSections] = useState<SectionType[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSectionsAndProducts() {
            try {
                // Obter as seções do Firebase
                const sectionsData = await getAllSections();
                setSections(sectionsData);

                // Obter produtos por seção
                const sectionNames = sectionsData.map((section) => section.sectionName);
                const products = await getFirstNewestDocBySection(sectionNames);
                
                setFeaturedProducts(products);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Falha ao carregar os dados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        }

        fetchSectionsAndProducts();
    }, [getAllProducts, getAllSections]);

    async function getFirstNewestDocBySection(sectionList: string[]) {
        const featuredProducts = [];
        for (const section of sectionList) {
            const orderByNewest: OrderByOption = { field: 'creationDate', direction: 'desc' };
            const newFeaturedProducts = await getAllProducts(
                [
                    { field: 'estoqueTotal', operator: '>=', value: 1 },
                    { field: 'showProduct', operator: '==', value: true },
                    { field: 'sections', operator: 'array-contains', value: section },
                ],
                1,
                orderByNewest,
            );
            newFeaturedProducts[0] && featuredProducts.push(newFeaturedProducts[0]);
        }
        return featuredProducts;
    }

    const LoadingSkeleton = () => (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <div className="w-full h-[70vh] bg-skeleton animate-pulse" />
            <div className="bg-gray-100 py-4 px-6 w-full">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    { [1, 2, 3].map((index) => (
                        <div key={ index } className="h-16 bg-skeleton animate-pulse rounded" />
                    )) }
                </div>
            </div>
            <div className="max-w-6xl mx-auto p-4">
                <div className="h-8 w-48 bg-skeleton animate-pulse rounded mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    { [1, 2, 3, 4].map((index) => (
                        <div key={ index } className="aspect-square bg-skeleton animate-pulse rounded" />
                    )) }
                </div>
            </div>
        </div>
    );

    if (loading) return <LoadingSkeleton />;
    if (error) return <div className="text-center py-10 text-red-500">{ error }</div>;

    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroSection />
            <InfoBanner />
            <SectionsCarousel sections={ sections.map((section) => section.sectionName) } />
            <FeaturedProducts featuredProducts={ featuredProducts }/>
        </div>
    );
}
