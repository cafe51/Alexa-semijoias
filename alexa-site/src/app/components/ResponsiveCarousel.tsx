//app/components/ResponsiveCarousel.tsx

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ProductBundleType } from '../utils/types';
import Image from 'next/image';
import { DocumentData } from 'firebase/firestore';

export default function ResponsiveCarousel({ productData }: { productData: ProductBundleType & DocumentData }) {
    return (
        <div className=''>
            <Carousel
                showArrows={ true }
                showIndicators={ true }
                infiniteLoop={ true }
                emulateTouch
                className='w-[300px] '
                swipeable={ true }
                showThumbs={ true }
            >
                { productData.images.map((image: string, index) => (
                    <div key={ productData.id + '(' + index + ')' } className='w-full rounded-lg relative h-[350px] '>
                        <Image
                            className='rounded-lg object-cover scale-110'
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
