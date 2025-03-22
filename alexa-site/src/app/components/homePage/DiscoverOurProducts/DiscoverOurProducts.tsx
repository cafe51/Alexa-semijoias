'use client';
// src/app/components/homePage/DiscoverOurProducts/DiscoverOurProducts.tsx
import { useState, useMemo } from 'react';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import DiscoverOurProductsButtonsCarousel from './DiscoverOurProductsButtonsCarousel';
import DiscoverOurProductsImagesCarousel from './DiscoverOurProductsImagesCarousel';
import Link from 'next/link';
import { createSlugName } from '@/app/utils/createSlugName';

interface DiscoverOurProductsProps {
  products: (ProductBundleType & FireBaseDocument)[];
  sections: string[];
}

export default function DiscoverOurProducts({ products, sections }: DiscoverOurProductsProps) {
    const [activeSection, setActiveSection] = useState<string>(sections[0] || '');

    // Agrupa os produtos por seção (assume que cada produto possui a propriedade \"section\")  
    const productsBySection = useMemo(() => {
        return sections.reduce((acc, section) => {
            const sectionProducts = products.filter((product) => product.sections[0] === section);
            if (sectionProducts.length > 0) {
                acc[section] = sectionProducts;
            }
            return acc;
        }, {} as Record<string, (ProductBundleType & FireBaseDocument)[]>);
    }, [products, sections]);

    return (
        <section className="py-14 md:flex md:flex-col md:items-center md:justify-center">
            <h1 className="text-2xl sm:text-3xl text-center mb-6 sm:mb-8 md:mb-12">Descubra Nossas Peças</h1>

            <DiscoverOurProductsButtonsCarousel
                sections={ sections }
                activeSection={ activeSection }
                setActiveSection={ setActiveSection }
            />

            { activeSection && (
                <DiscoverOurProductsImagesCarousel products={ productsBySection[activeSection] || [] } />
            ) }
            <Link href={ `/section/${createSlugName(activeSection)}` } className="flex justify-center items-center my-6">
                <button className="px-6 p-4 bg-black text-white rounded-full">Ver todos</button>
            </Link>

        </section>
    );
}
