import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { Badge } from '@/components/ui/badge';


export default function ProductCategories({ product }: {product: ProductBundleType & FireBaseDocument}) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            { product.categories.map((category, index) => (
                <Badge key={ index } variant="secondary" className="bg-[#F8C3D3] text-[#333333]">
                    { category }
                </Badge>
            )) }
            { product.lancamento && <Badge variant="destructive" className="bg-[#C48B9F] text-white">Lançamento</Badge> }
        </div>
    );
}