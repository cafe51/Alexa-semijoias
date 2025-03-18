'use client';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { EmblaOptionsType } from 'embla-carousel';
// import {
//     PrevButton,
//     NextButton,
//     usePrevNextButtons,
// } from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '../ProductList/ProductCard';

type PropType = {
    products: (ProductBundleType & FireBaseDocument)[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = ({ products, options }) => {
    const [
        emblaRef,
        // emblaApi
    ] = useEmblaCarousel(options);

    // const {
    //     prevBtnDisabled,
    //     nextBtnDisabled,
    //     onPrevButtonClick,
    //     onNextButtonClick,
    // } = usePrevNextButtons(emblaApi);

    return (
        <section className="embla">
            <div className="embla__viewport" ref={ emblaRef }>
                <div
                    className="embla__container "
                    // style={ { touchAction: 'pan-y pinch-zoom' } }
                >
                    { products.map((product) => (
                        <div
                            key={ product.id }
                            className="embla__slide"
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
        </section>
    );
};

export default EmblaCarousel;
