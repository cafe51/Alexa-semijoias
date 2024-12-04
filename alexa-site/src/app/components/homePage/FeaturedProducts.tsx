import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from '../ProductList/ProductCard';

export default function FeaturedProducts({ featuredProducts }: { featuredProducts: (ProductBundleType & FireBaseDocument)[] }){

    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 bg-[#F8C3D3] bg-opacity-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">DESTAQUES</h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                { featuredProducts && featuredProducts.length > 0 && featuredProducts.map((product) => {
                    return (
                        <div key={ product.id } className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] max-w-xs">
                            <ProductCard product={ product } homePage />
                        </div>
                    );
                }) }
            </div>
        </section>
    );
}