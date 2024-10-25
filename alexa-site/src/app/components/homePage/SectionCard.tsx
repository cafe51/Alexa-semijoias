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

            // Primeira consulta
            let randomProducts = await getAllProducts([...pedidosFiltrados, { field: 'randomIndex', operator: '>=', value: randomSelectorValue }], 4);

            // Segunda consulta se necessário
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
        <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
                <Link href={ `/section/${section}` } className='relative aspect-square'>
                    <Image
                        className="rounded-lg rounded-b-none object-cover scale-100"
                        src={ imageUrl }
                        alt={ section }
                        sizes="3000px"
                        priority
                        fill
                    />
                </Link>
            </CardContent>

            <div className="p-4 text-center bg-[#C48B9F]">
                <h3 className="font-semibold text-xl text-white">
                    { section.toUpperCase() }
                </h3>
            </div>
        </Card>
    );
}