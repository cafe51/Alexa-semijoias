//src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from './components/homePage/HeroSection';
import SectionsCarousel from './components/homePage/SectionsCarousel';
import FeaturedProducts from './components/homePage/FeaturedProducts';
// import Newsletter from './components/homePage/Newsletter';
import { useCollection } from './hooks/useCollection';
import { FireBaseDocument, OrderByOption, ProductBundleType, SectionType } from './utils/types';

export default function HomePage() {
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
    }, []);

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

    if (loading) return <div className="text-center py-10 h-screen">Carregando...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{ error }</div>;

    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full mt-[-170px]">
            <HeroSection />
            <SectionsCarousel sections={ sections.map((section) => section.sectionName) } />
            <FeaturedProducts featuredProducts={ featuredProducts }/>
            {
            /* <Newsletter /> */
            }
        </div>
    );
}
