/* eslint-disable react/jsx-curly-spacing */
'use client';
import Product from '@/app/components/Product';

export default function UserPosts({ params }: { params: { id: string } }) {
    return (
        <Product id={params.id} />
    );
}