import Image from 'next/image';
import { FireBaseDocument, ProductBundleType } from '../utils/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function ImageCarousel({ productData: { images, name } }: { productData: ProductBundleType & FireBaseDocument }) {

    // console.log('PRODUCT ON CAROUSEL', images);
    return (
        <div className="w-full px-0 -mx-2 sm:mx-0">
            <Carousel className="w-full">
                <CarouselContent className="w-full">
                    { images.map((image, index) => (
                        <CarouselItem key={ index } className="px-0 w-full">
                            <div className="w-full aspect-[4/5] relative bg-skeleton">
                                <Image
                                    alt={ `${name} - Imagem ${index + 1}` }
                                    src={ image.localUrl }
                                    fill
                                    sizes="3000px"
                                    className="object-cover"
                                    priority={ index === 0 }
                                    // loading={ index === 0 ? 'eager' : 'lazy' }
                                    quality={ 85 }
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
