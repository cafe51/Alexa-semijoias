import Image from 'next/image';
import { FireBaseDocument, ProductBundleType } from '../utils/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function ImageCarousel({ productData: { images } }: { productData: ProductBundleType & FireBaseDocument }) {

    return (
        <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <CarouselContent className='' >
                { images.map((image, index) => (
                    <CarouselItem key={ index } className='aspect-square relative'>
                        <Image
                            className="w-full h-auto rounded-lg shadow-md"
                            alt={ `Slide ${index + 1}` } 
                            src={ image.localUrl }
                            fill
                            sizes='220px'
                            priority
                        />
                    </CarouselItem>
                )) }
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 hover:bg-[#F8C3D3]/20" />
            <CarouselNext className="right-2 bg-white/80 hover:bg-[#F8C3D3]/20" />
        </Carousel>
    );
}