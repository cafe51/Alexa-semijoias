import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';
import blankImage from '../../../../public/blankImage.png';
import Image from 'next/image';
import Link from 'next/link';
import { BuyButtonOnCard } from './BuyButtonOnCard';
import toTitleCase from '@/app/utils/toTitleCase';

const calculateDiscount = (original: number, promotional: number) => {
    return Math.round(((original - promotional) / original) * 100);
};

export default function ProductCard({ product, homePage=false }: { product: ProductBundleType & FireBaseDocument; homePage?: boolean}) { 
    const displayPrice = product.value.promotionalPrice || product.value.price;
    const installmentValue = displayPrice / 6;
    const slugName = product.slug;

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border-[#F8C3D3] shadow-md shadow-[#F8C3D3] border-none rounded-lg">
            <CardContent className="p-0 flex flex-col h-full">
                <Link href={ `/product/${slugName}` } className='relative aspect-square'>
                    <div className="relative w-full h-full bg-skeleton">
                        <Image
                            data-testid="product-link"
                            className='rounded-lg rounded-b-none object-cover scale-100'
                            src={ product.images && product.images[0] ? product?.images[0].localUrl : blankImage.src }
                            alt={ `Foto de ${product.name}` }
                            sizes="3000px"
                            priority={ homePage }
                            loading={ homePage ? 'eager' : 'lazy' }
                            quality={ 90 }
                            fill
                        />
                    </div>
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                        { product.lancamento && (
                            <Badge className="bg-[#C48B9F] text-white text-xs sm:text-sm md:text-base lg:text-lg">
                        Lançamento
                            </Badge>
                        ) }
                        { product.value.promotionalPrice > 0 && (
                            <Badge className="bg-[#F8C3D3] text-[#333333] text-xs sm:text-sm md:text-base lg:text-lg ml-auto">
                        -{ calculateDiscount(product.value.price, product.value.promotionalPrice) }%
                            </Badge>
                        ) }
                    </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-[#333333] line-clamp-2">
                        { toTitleCase(product.name) }
                    </h3>

                    <div className="flex flex-col mb-3 flex-grow">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#D4AF37]">
                                { formatPrice(displayPrice) }
                            </span>
                            { product.value.promotionalPrice > 0 && (
                                <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 line-through">
                                    { formatPrice(product.value.price) }
                                </span>
                            ) }
                        </div>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-1">
                    ou até 6x de <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-[#C48B9F]">{ formatPrice(installmentValue) }</span> sem juros
                        </p>
                    </div>

                    {
                        !homePage && <BuyButtonOnCard product={ product } />
                    }
                </div>
            </CardContent>
        </Card>

    );
}
