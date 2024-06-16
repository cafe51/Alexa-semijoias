//app/components/ResponsiveCarousel.tsx

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ProductType } from '../utils/types';
import Image from 'next/image';

export default function ResponsiveCarousel({ productData }: { productData: ProductType }) {
    return (
        <div className=''>
            <Carousel
                showArrows={ true }
                showIndicators={ true }
                infiniteLoop={ true }
                emulateTouch
                className='w-[300px] '
                swipeable={ true }
                showThumbs
            >
                { productData.image.map((image: string) => (
                    <div key={ productData.id } className='w-full rounded-lg relative h-[350px] '>
                        <Image
                            key={ productData.id }
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

{/* <Image
                                className='rounded-lg object-cover scale-125'
                                src={ item.imageUrl }
                                alt="slides"
                                // fill
                                width={ 200 }
                                height={ 200 }
                            />  */}

{/* <img
    className=''
    src={ image } alt='slides'
/>; */}