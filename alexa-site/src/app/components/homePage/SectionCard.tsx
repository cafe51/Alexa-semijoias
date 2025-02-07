// src/app/components/homePage/SectionCard.tsx
'use client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { FilterOption, ProductBundleType } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import Link from 'next/link';
import { createSlugName } from '@/app/utils/createSlugName';

interface SectionCardProps {
    section: string;
}

export default function SectionCard({ section }: SectionCardProps) {
    const [randomProduct, setRandomProduct] = useState<ProductBundleType | null>(null);
    const { getAllDocuments: getAllProducts } = useCollection<ProductBundleType>('products');

    const pedidosFiltrados = useMemo<FilterOption[]>(() => {
        return [
            { field: 'sections', operator: 'array-contains', value: section },
        ];
    }, [section]);

    useEffect(() => {
        async function fetchRandomProduct() {
            const randomSelectorValue = Math.floor(Math.random() * 99).toString().padStart(2, '0');
            let randomProducts = await getAllProducts([...pedidosFiltrados, { field: 'randomIndex', operator: '>=', value: randomSelectorValue }], 4);
            
            if (randomProducts.length === 0) {
                randomProducts = await getAllProducts([...pedidosFiltrados, { field: 'randomIndex', operator: '<', value: randomSelectorValue }], 4);
            }

            const newRandomIndex = Math.floor(Math.random() * randomProducts.length);
            setRandomProduct(randomProducts[newRandomIndex]);
        }

        fetchRandomProduct();
    }, [section, getAllProducts, pedidosFiltrados]);

    const imageUrl = getImageUrlFromFirebaseProductDocument(randomProduct);
    
    if (!randomProduct) {
        return (
            <Card className="relative overflow-hidden flex flex-col">
                <div className="aspect-square bg-skeleton animate-pulse rounded-lg" />
                <div className="h-16 bg-skeleton animate-pulse mt-2 rounded" />
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
            <Link href={ `/section/${createSlugName(section)}` } className="block">
                <div className="relative">
                    <div className='relative aspect-square bg-skeleton'>
                        <Image
                            className="rounded-lg object-cover loading"
                            src={ imageUrl }
                            alt={ `Seção de ${section}` }
                            sizes="300px"
                            quality={ 80 }
                            priority={ false }
                            loading="lazy"
                            fill
                            onLoad={ (event) => {
                                const img = event.target as HTMLImageElement;
                                img.classList.remove('loading');
                                img.classList.add('loaded');
                            } }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#C48B9F] from-0% via-[#C48B9F]/80 via-10% via-[#C48B9F]/25 via-10% to-transparent to-40%" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                        <h2 className="font-semibold text-xl sm:text-2xl text-white px-4 sm:px-6">
                            { section.toUpperCase() }
                        </h2>
                    </div>
                </div>
            </Link>
        </Card>
    );
}
