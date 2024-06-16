//app/colares/[id]/page.tsx

'use client';
import Product from '@/app/components/Product';

export default function Colares({ params }: { params: { id: string } }) {
    return (
        <Product id={ params.id } productType={ 'colares' } />
    );
}