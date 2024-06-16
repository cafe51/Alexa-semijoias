//app/aneis/[id]/page.tsx

'use client';
import Product from '@/app/components/Product';

export default function Aneis({ params }: { params: { id: string } }) {
    return (
        <Product id={ params.id } productType={ 'aneis' } />
    );
}