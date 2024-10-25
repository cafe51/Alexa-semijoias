// SectionCard.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { FilterOptionForUseSnapshot, ProductBundleType } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import Link from 'next/link';

interface SectionCardProps {
    section: string;
}

export default function SectionCard({ section }: SectionCardProps) {
    const [randomProduct, setRandomProduct] = useState<ProductBundleType | null>(null);
    const { getAllDocuments: getAllProducts } = useCollection<ProductBundleType>('products');

    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[]>(() => {
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



    return (
        <Card className="relative overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-t from-[#C48B9F] from-0% via-[#C48B9F]/80 via-10% via-[#C48B9F]/40 via-25% to-transparent to-40% z-10" />
            <CardContent className="p-0 flex flex-col h-full z-0">
                <Link href={ `/section/${section}` } className='relative aspect-square'>
                    <Image
                        className="rounded-lg rounded-b-none object-cover scale-100 z-0"
                        src={ imageUrl }
                        alt={ section }
                        sizes="3000px"
                        priority
                        fill
                    />
                </Link>
            </CardContent>

            <div className="relative text-center h-16">
                { /* Container para a imagem de fundo */ }
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 -top-[300px]">
                        <Image
                            src={ imageUrl }
                            alt={ section }
                            fill
                            className="object-cover object-bottom"
                            sizes="3000px"
                            priority
                        />
                    </div>
                </div>
                
                { /* Texto */ }
                <h3 className="relative z-30 font-semibold text-xl sm:text-2xl text-white inline-block px-4 sm:px-6 py-2 sm:py-3">
                    { section.toUpperCase() }
                </h3>
            </div>
        </Card>
    );
}