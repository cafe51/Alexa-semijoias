// src/app/components/homePage/SectionCard.tsx
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import { createSlugName } from '@/app/utils/createSlugName';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';

interface SectionCardProps {
  section: string;
  product: (ProductBundleType & FireBaseDocument) | null;
}

export default function SectionCard({ section, product }: SectionCardProps) {
    const imageUrl = product ? getImageUrlFromFirebaseProductDocument(product) : '';

    if (!product) {
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
                    <div className="relative aspect-square bg-skeleton">
                        <Image
                            className="rounded-lg object-cover"
                            src={ imageUrl }
                            title={ `Seção de ${section}` }
                            alt={ `Seção de ${section}` }
                            sizes="150px"
                            quality={ 80 }
                            loading="eager"
                            fill
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
