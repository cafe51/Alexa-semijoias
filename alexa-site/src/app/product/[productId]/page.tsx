//app/product/[productId]/page.tsx

import Product from '@/app/components/ProductPage/Product';


export default function ProductScreenPage({ params: { productId } }: { params: { productId: string} }) {

    return (
        <Product id={ productId } />
    );
}
