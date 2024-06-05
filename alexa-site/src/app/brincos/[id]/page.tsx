'use client';
import Product from '@/app/components/Product';

export default function Brinco({ params }: { params: { id: string } }) {
    return (
        <Product id={ params.id } productType={ 'brincos' } />
    );
}