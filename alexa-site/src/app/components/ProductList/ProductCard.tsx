// src/app/components/ProductList/ProductCard.tsx
'use client';

import React, { memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';
import blankImage from '../../../../public/blankImage.png';
import Image from 'next/image';
import Link from 'next/link';
import { BuyButtonOnCard } from './BuyButtonOnCard';
import toTitleCase from '@/app/utils/toTitleCase';
import { createSlugName } from '@/app/utils/createSlugName';
import ProductCardBadges from './ProductCardBadges';
import OutOfStockLayer from './OutOfStockLayer';

interface ProductCardProps {
  product: ProductBundleType & FireBaseDocument;
  homePage?: boolean;
}

function ProductCard({ product, homePage = false }: ProductCardProps) {
    // Define o preço a ser exibido (promocional ou o normal)
    const displayPrice = product.value.promotionalPrice || product.value.price;

    // Memoriza o valor da parcela
    const installmentValue = useMemo(() => displayPrice / 6, [displayPrice]);

    // Memoriza o slug do produto
    const productSlug = useMemo(() => createSlugName(product.name), [product.name]);

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border-[#F8C3D3] shadow-md shadow-[#F8C3D3] border-none rounded-lg">
            <CardContent className="p-0 flex flex-col h-full">
                <Link
                    href={ `/product/${productSlug}` }
                    className="relative aspect-[4/5]"
                    aria-label={ `Ver detalhes da semijoia ${toTitleCase(product.name)}` }
                    title={ `Ver detalhes da semijoia ${toTitleCase(product.name)}` }
                >
                    <div className="relative w-full h-full bg-skeleton">
                        <Image
                            data-testid="product-link"
                            className={ `rounded-lg rounded-b-none object-cover scale-100 ${product.estoqueTotal <= 0 ? 'opacity-50' : ''}` }
                            src={
                                product.images && product.images[0]
                                    ? product.images[0].localUrl
                                    : blankImage.src
                            }
                            alt={ `Foto de ${product.name}` }
                            title={ `Foto de ${product.name}` }
                            sizes={ '3000px' }
                            fill
                            placeholder="blur" // melhora a percepção de carregamento
                            blurDataURL={ blankImage.src }
                            priority={ homePage } // imagens prioritárias na homepage
                            // loading={ homePage ? 'eager' : 'lazy' }
                            quality={ 75 } // reduz um pouco a qualidade para diminuir o tamanho do arquivo
                        />
                    </div>
                    <span className="sr-only">{ toTitleCase(product.name) }</span>
                    <ProductCardBadges product={ product }/>
                    <OutOfStockLayer outOfStock={ product.estoqueTotal <= 0 }/>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-[#333333] line-clamp-2">
                        { toTitleCase(product.name) }
                    </h3>

                    <div className="flex flex-col mb-3 flex-grow">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-2xl lg:text-3xl font-bold text-[#D4AF37]">
                                { formatPrice(displayPrice) }
                            </span>
                            { product.value.promotionalPrice > 0 && (
                                <span className="text-lg lg:text-xl text-gray-500 line-through">
                                    { formatPrice(product.value.price) }
                                </span>
                            ) }
                        </div>

                        <p className="text-lg lg:text-xl text-gray-600 mt-1">
              ou até 6x de{ ' ' }
                            <span className="font-semibold text-2xl lg:text-4xl text-[#C48B9F]">
                                { formatPrice(installmentValue) }
                            </span>{ ' ' }
              sem juros
                        </p>
                    </div>

                    { !homePage && <BuyButtonOnCard product={ product } /> }
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(ProductCard);
