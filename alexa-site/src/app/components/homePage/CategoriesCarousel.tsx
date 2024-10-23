import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import CategoryCard from './CategoryCard';

export default function CategoriesCarousel({ categories }: { categories: string[] }) {
    return (
        <section className="py-8 sm:py-12 md:py-16 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Nossas Categorias</h2>
            <Carousel
                opts={ {
                    align: 'start',
                    loop: true,
                } }
                className="w-full max-w-5xl mx-auto"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    { categories.map((category, index) => (
                        <CarouselItem key={ index } className="pl-2 md:pl-4 basis-4/5 sm:basis-2/3 md:basis-2/3 lg:basis-2/5 xl:basis-1/3">
                            <CategoryCard category={ category } />
                        </CarouselItem>
                    )) }
                </CarouselContent>
                
                <div className="hidden xl:flex justify-end mt-4">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>
        </section>
    );
}