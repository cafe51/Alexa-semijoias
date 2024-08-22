//app/product/[productId]/page.tsx

import Product from '@/app/components/ProductPage/Product';


export default function ProductScreenPage({ params: { productId } }: { params: { productId: string} }) {

    return (
        // <p>{ `${sectionName}:${decodeURIComponent(subsectionName)}` }</p>
        <Product id={ productId } />
    );
}
