//app/components/ResponsiveCarousel.tsx

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FireBaseDocument, ProductBundleType } from '../utils/types';
import Image from 'next/image';
import blankImage from '../../../public/blankImage.png';


export default function ResponsiveCarousel({ productData }: { productData: ProductBundleType & FireBaseDocument }) {
    return (
        <div className=''>
            <Carousel
                showArrows={ true }
                showIndicators={ true }
                infiniteLoop={ true }
                emulateTouch
                className='w-[330px] '
                swipeable={ true }
                showThumbs={ false }
            >
                { (productData.images ? productData.images.sort((a, b) => a.index - b.index).map((image) => image.localUrl) : [blankImage.src, blankImage.src, blankImage.src]).map((image: string, index) => (
                    <div key={ productData.id + '(' + index + ')' } className='w-full rounded-lg relative h-[330px] '>
                        <Image
                            className='rounded-lg object-cover scale-80'
                            src={ image }
                            alt="slides"
                            fill
                        />
                    </div>
                )) }
            </Carousel>
        </div>
    );
}
