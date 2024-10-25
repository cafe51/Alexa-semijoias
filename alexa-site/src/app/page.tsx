import React from 'react';
import HeroSection from './components/homePage/HeroSection';
import SectionsCarousel from './components/homePage/SectionsCarousel';
import FeaturedProducts from './components/homePage/FeaturedProducts';
import Newsletter from './components/homePage/Newsletter';
import { useCollection } from './hooks/useCollection';
import { SectionType } from './utils/types';

export default async function HomePage() {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');

    const sections = await getAllSections();
    
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen">
            <HeroSection />
            <SectionsCarousel sections={ sections.map((section) => section.sectionName) } />
            <FeaturedProducts />
            <Newsletter />
        </div>
    );
}
