//app/pulseiras/[id]/page.tsx

'use client';
import Product from '@/app/components/Product';

export default function Pulseira({ params }: { params: { id: string } }) {
    return (
        <Product id={ params.id } productType={ 'pulseiras' } />
    );
}