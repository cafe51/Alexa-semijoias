// src/app/components/ProductPage/RecommendedProducts.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRecommendedProducts } from '@/app/hooks/useRecommendedProducts';
import DiscoverOurProductsImagesCarousel from '../homePage/DiscoverOurProducts/DiscoverOurProductsImagesCarousel';
  
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
                        <div key={ index } className="aspect-square bg-skeleton "></div>
                    )) }
                </div>
            </CardContent>
        </Card>
    );
  
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-center py-10 text-red-500">{ error }</div>;
  
    return (
        <Card className="mt-12  min-h-[400px] rounded-none  border-0 shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl lg:text-3xl text-center text-[#333333]">
            Você Também Vai Amar
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 w-full">
                <DiscoverOurProductsImagesCarousel products={ recommendedProducts } />

            </CardContent>
        </Card>
    );
}
  