// src/app/components/homePage/SectionsCarousel.tsx
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import SectionCard from './SectionCard';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
  
  interface SectionWithProduct {
    section: string;
    product: (ProductBundleType & FireBaseDocument) | null;
  }
  
  interface SectionsCarouselProps {
    sections: SectionWithProduct[];
  }
  
export default function SectionsCarousel({ sections }: SectionsCarouselProps) {
    const hasSections = Array.isArray(sections) && sections.length > 0;
  
    return (
        <section className="py-8 sm:py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl text-center mb-6 sm:mb-8 md:mb-12">ESCOLHA POR SEÇÃO</h1>
  
                <div className="min-h-[300px]">
                    { hasSections ? (
                        <Carousel
                            opts={ {
                                align: 'start',
                                loop: true,
                            } }
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                { sections.map((item, index) => (
                                    <CarouselItem
                                        key={ index }
                                        className="pl-2 md:pl-4 basis-11/12 md:basis-2/3 lg:basis-2/5 transition-opacity duration-300"
                                    >
                                        <SectionCard section={ item.section } product={ item.product } />
                                    </CarouselItem>
                                )) }
                            </CarouselContent>
  
                            { sections.length > 3 && (
                                <div className="hidden xl:flex justify-end mt-4 gap-2">
                                    <CarouselPrevious className="bg-white/80 hover:bg-[#F8C3D3]/20 border-[#F8C3D3]" />
                                    <CarouselNext className="bg-white/80 hover:bg-[#F8C3D3]/20 border-[#F8C3D3]" />
                                </div>
                            ) }
                        </Carousel>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            { [1, 2, 3].map((index) => (
                                <div key={ index } className="aspect-[4/3]">
                                    <div className="w-full h-full bg-skeleton animate-pulse rounded-lg" />
                                </div>
                            )) }
                        </div>
                    ) }
                </div>
            </div>
        </section>
    );
}
  