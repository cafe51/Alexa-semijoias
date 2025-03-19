// src/app/components/homePage/DiscoverOurProducts/DiscoverOurProductsImagesCarousel.tsx
'use client';
import useEmblaCarousel from 'embla-carousel-react';
import AutoPlay from 'embla-carousel-autoplay';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../../ProductList/ProductCard';

// Função que garante sempre 6 produtos, repetindo itens se necessário
function productsToShow(products: (ProductBundleType & FireBaseDocument)[]): (ProductBundleType & FireBaseDocument)[] {
    const total = products.length;
    if (total === 0) return [];
    // Se houver 6 ou mais, pega os 6 primeiros
    if (total >= 6) return products.slice(0, 6);
  
    // Se houver menos, preenche repetindo os produtos
    const result: (ProductBundleType & FireBaseDocument)[] = [];
    for (let i = 0; i < 6; i++) {
        result.push(products[i % total]);
    }
    return result;
}

export default function DiscoverOurProductsImagesCarousel({
    products,
}: {
  products: (ProductBundleType & FireBaseDocument)[];
}) {
    const [emblaRef] = useEmblaCarousel(
        { align: 'start', dragFree: false, loop: true },
        [
            AutoPlay({
                stopOnFocusIn: false,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnLastSnap: false,
            }),
        ],
    );

    // Aplica a função para garantir 6 produtos
    const finalProducts = productsToShow(products);

    return (
        <div
            className="max-w-[90rem] mx-auto"
            style={ {
                '--slide-height': '19rem',
                '--slide-spacing': '1rem',
                '--slide-size': '70%',
                '--slide-spacing-sm': '1.6rem',
                '--slide-size-sm': '50%',
                '--slide-spacing-lg': '2rem',
                '--slide-size-lg': '30%',
            } as React.CSSProperties }
        >
            <div className="overflow-hidden" ref={ emblaRef }>
                <div
                    className="flex ml-[calc(var(--slide-spacing)*-1)] min-[750px]:ml-[calc(var(--slide-spacing-sm)*-1)] min-[1200px]:ml-[calc(var(--slide-spacing-lg)*-1)]"
                    style={ { touchAction: 'pan-y pinch-zoom', backfaceVisibility: 'hidden' } }
                >
                    { finalProducts.map((product, index) => (
                        <div
                            key={ `${product.id}-${index}` } // Garante chave única mesmo com repetições
                            className={
                                'min-w-0 pl-[var(--slide-spacing)] flex-[0_0_var(--slide-size)] min-[750px]:pl-[var(--slide-spacing-sm)] min-[750px]:flex-[0_0_var(--slide-size-sm)] min-[1200px]:pl-[var(--slide-spacing-lg)] min-[1200px]:flex-[0_0_var(--slide-size-lg)]'
                            }
                        >
                            <ProductCard product={ product } homePage />
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
}
