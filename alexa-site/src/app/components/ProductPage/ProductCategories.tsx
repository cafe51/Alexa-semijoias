import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


export default function ProductCategories({ product }: {product: ProductBundleType & FireBaseDocument}) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            { product.categories.map((category, index) => (
                <Link key={ index } href={ `/search/${ encodeURIComponent(category) }` }>
                    <Badge variant="secondary" className="bg-[#F8C3D3] text-[#333333]">
                        { category }
                    </Badge>
                </Link>
            )) }
            { product.lancamento && <Badge variant="destructive" className="bg-[#C48B9F] text-white">Lançamento</Badge> }
        </div>
    );
}