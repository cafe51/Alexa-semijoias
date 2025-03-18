// import {
//     PrevButton,
//     NextButton,
//     usePrevNextButtons,
// } from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';

import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../../ProductList/ProductCard';

export default function DiscoverOurProductsImagesCarousel({ products }: {products: (ProductBundleType & FireBaseDocument)[] }) {
    const [
        emblaRef,
    // emblaApi
    ] = useEmblaCarousel({ align: 'start', dragFree: false, loop: true });

    // const {
    //     prevBtnDisabled,
    //     nextBtnDisabled,
    //     onPrevButtonClick,
    //     onNextButtonClick,
    // } = usePrevNextButtons(emblaApi);
    return (
        <div className="embla">
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
        </div>
    );
}