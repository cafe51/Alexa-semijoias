import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../ProductList/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturedProducts({ featuredProducts }: { featuredProducts: (ProductBundleType & FireBaseDocument)[] }) {
    const hasProducts = Array.isArray(featuredProducts) && featuredProducts.length > 0;

    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 flex flex-col items-center">
            <div className="mx-auto">
                <h2 className="font-normal text-3xl text-center mb-6 sm:mb-8 md:mb-12">DESTAQUES</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 min-h-[300px]">
                    { hasProducts ? (
                        featuredProducts.map((product) => (
                            <div 
                                key={ product.id } 
                                className="w-full max-w-xs mx-auto transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                            >
                                <ProductCard product={ product } homePage />
                            </div>
                        ))
                    ) : (
                        // Placeholders para manter o layout consistente
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={ index } className="w-full max-w-xs mx-auto">
                                <div className="aspect-square bg-skeleton animate-pulse rounded-lg" />
                            </div>
                        ))
                    ) }
                </div>
            </div>
            <Link
                href="/section"

            >
                <Button
                    variant="outline"
                    className="m-auto text-lg border-[#C48B9F] text-[#C48B9F] hover:bg-[#C48B9F] hover:text-white px-4 py-2 mt-8"
                >
                Ver Todas as Peças
                </Button>
            </Link>

        </section>
    );
}
