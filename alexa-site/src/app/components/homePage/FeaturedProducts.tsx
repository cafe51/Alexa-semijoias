import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../ProductList/ProductCard';

export default function FeaturedProducts({ featuredProducts }: { featuredProducts: (ProductBundleType & FireBaseDocument)[] }) {
    const hasProducts = Array.isArray(featuredProducts) && featuredProducts.length > 0;

    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 bg-[#F8C3D3] bg-opacity-20">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">DESTAQUES</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 min-h-[300px]">
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
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={ index } className="w-full max-w-xs mx-auto">
                                <div className="aspect-square bg-skeleton animate-pulse rounded-lg" />
                            </div>
                        ))
                    ) }
                </div>
            </div>
        </section>
    );
}
