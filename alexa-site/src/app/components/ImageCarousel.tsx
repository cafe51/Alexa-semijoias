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
        <div className="w-full px-0 -mx-2 sm:mx-0">
            <Carousel className="w-full">
                <CarouselContent className="w-full">
                    { images.map((image, index) => (
                        <CarouselItem key={ index } className="px-0 w-full">
                            <div className="w-full aspect-square relative">
                                <Image
                                    alt={ `Slide ${index + 1}` }
                                    src={ image.localUrl }
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </CarouselItem>
                    )) }
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/80 hover:bg-[#F8C3D3]/20" />
                <CarouselNext className="right-2 bg-white/80 hover:bg-[#F8C3D3]/20" />
            </Carousel>
        </div>
    );
}