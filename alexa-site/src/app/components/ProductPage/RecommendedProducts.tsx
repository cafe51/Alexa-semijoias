// src/app/components/ProductPage/RecommendedProducts.tsx
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProductCard from '../ProductList/ProductCard';
import { useRecommendedProducts } from '@/app/hooks/useRecommendedProducts';
  
  interface RecommendedProductsProps {
    mainProductId: string;
  }
  
export default function RecommendedProducts({ mainProductId }: RecommendedProductsProps) {
    const { recommendedProducts, loading, error } = useRecommendedProducts(mainProductId);
  
    const SkeletonLoader = () => (
        <Card className="mt-12 border-[#F8C3D3] shadow-md shadow-[#F8C3D3] min-h-[400px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl lg:text-3xl text-center text-[#333333]">
            Você Também Vai Amar
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    { [1, 2, 3, 4].map((index) => (
                        <div key={ index } className="aspect-square bg-skeleton rounded-lg"></div>
                    )) }
                </div>
            </CardContent>
        </Card>
    );
  
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-center py-10 text-red-500">{ error }</div>;
  
    return (
        <Card className="mt-12 border-[#F8C3D3] shadow-md shadow-[#F8C3D3] min-h-[400px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl lg:text-3xl text-center text-[#333333]">
            Você Também Vai Amar
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                { /* Grid para telas pequenas e médias */ }
                <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px]">
                    { recommendedProducts.map((product, index) => (
                        <div key={ index }>
                            <ProductCard product={ product } homePage={ true } />
                        </div>
                    )) }
                </div>
                { /* Carousel para telas grandes */ }
                <div className="hidden lg:block min-h-[300px]">
                    <Carousel
                        opts={ {
                            align: 'start',
                            loop: true,
                            containScroll: false,
                        } }
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            { recommendedProducts.map((product, index) => (
                                <CarouselItem key={ index } className="pl-4 basis-[22%]">
                                    <ProductCard product={ product } homePage={ true } />
                                </CarouselItem>
                            )) }
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-white/80 hover:bg-[#F8C3D3]/20 border-[#F8C3D3]" />
                        <CarouselNext className="right-2 bg-white/80 hover:bg-[#F8C3D3]/20 border-[#F8C3D3]" />
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    );
}
  