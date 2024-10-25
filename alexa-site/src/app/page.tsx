import React from 'react';
import HeroSection from './components/homePage/HeroSection';
import SectionsCarousel from './components/homePage/SectionsCarousel';
import FeaturedProducts from './components/homePage/FeaturedProducts';
import Newsletter from './components/homePage/Newsletter';
import { useCollection } from './hooks/useCollection';
import { OrderByOption, ProductBundleType, SectionType } from './utils/types';

export default async function HomePage() {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');
    const { getAllDocuments: getAllProducts } = useCollection<ProductBundleType>('products');

    const sections = await getAllSections();

    async function getFirstNewstDocBySection(sectionList: string[]) {
        const featuredProducts = [];
        for (const section of sectionList) {
            const orderByNewest: OrderByOption = { field: 'creationDate', direction: 'desc' };
            const newFeaturedProducts = await getAllProducts(
                [
                    { field: 'sections', operator: 'array-contains', value: section },
                ],
                1,
                orderByNewest,
            );
            featuredProducts.push(newFeaturedProducts[0]);
        }
        return featuredProducts;

    } 

    const featuredProducts = await getFirstNewstDocBySection(sections.map((section) => section.sectionName));

    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen">
            <HeroSection />
            <SectionsCarousel sections={ sections.map((section) => section.sectionName) } />
            <FeaturedProducts featuredProducts={ featuredProducts.filter((featProduct) => featProduct.estoqueTotal >= 0) }/>
            <Newsletter />
        </div>
    );
}
