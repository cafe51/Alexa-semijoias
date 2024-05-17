/* eslint-disable @next/next/no-img-element */

//carousels/Responsive.js
import { Carousel } from 'react-responsive-carousel';
// import { items }  from '../../../public/cauroselProduct.json';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ProductType } from '../utils/types';

export default function ResponsiveCarousel({ productData }: { productData: ProductType }) {
    // const { responsive } = items;
    return (
        <div className=''>
            <Carousel
                showArrows={ true }
                showIndicators={ true }
                infiniteLoop={ true }
                // dynamicHeight={ false }
                emulateTouch
                // className='w-[150px]'
                swipeable={ true }
                showThumbs
            >
                { productData.image.map((image: string) => (
                    <div key={ productData.id } className=''>
                        <img src={ image } alt='slides'/>
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
