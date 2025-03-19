'use client';
// import {
//     PrevButton,
//     NextButton,
//     usePrevNextButtons,
// } from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import AutoPlay from 'embla-carousel-autoplay';

import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../../ProductList/ProductCard';

export default function DiscoverOurProductsImagesCarousel({ products }: {products: (ProductBundleType & FireBaseDocument)[] }) {
    const [
        emblaRef,
    // emblaApi
    ] = useEmblaCarousel({ align: 'start', dragFree: false, loop: true }, [AutoPlay({
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnLastSnap: false,
    })]);

    // const {
    //     prevBtnDisabled,
    //     nextBtnDisabled,
    //     onPrevButtonClick,
    //     onNextButtonClick,
    // } = usePrevNextButtons(emblaApi);
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
                    { products.map((product) => (
                        <div
                            key={ product.id }
                            className={
                                'min-w-0 ' +
                                'pl-[var(--slide-spacing)] ' +
                                'flex-[0_0_var(--slide-size)] ' +
                                'min-[750px]:pl-[var(--slide-spacing-sm)] ' +
                                'min-[750px]:flex-[0_0_var(--slide-size-sm)] ' +
                                'min-[1200px]:pl-[var(--slide-spacing-lg)] ' +
                                'min-[1200px]:flex-[0_0_var(--slide-size-lg)]'
                            }
                        >
                            <ProductCard product={ product } homePage />
                        </div>
                    )) }
                </div>
            </div>
            {

                // <div className="grid grid-cols-[auto_1fr] gap-[1.2rem] mt-[1.8rem]">
                //     <div className="grid grid-cols-2 gap-[0.6rem] items-center">
                //         <PrevButton onClick={ onPrevButtonClick } disabled={ prevBtnDisabled } />
                //         <NextButton onClick={ onNextButtonClick } disabled={ nextBtnDisabled } />
                //     </div>
                // </div>
            }
        </div>
    );
}