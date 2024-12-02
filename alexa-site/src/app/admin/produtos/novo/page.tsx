// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useProductConverter } from '@/app/hooks/useProductConverter';
import ProductEditionForm from '../ProductEditionForm';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
    const router = useRouter();
    const { useProductDataHandlers } = useProductConverter();
    const [goToProductPage, setGoToProductPage] = useState(false);

    useEffect(() => {
        if(goToProductPage) router.push('/admin/produtos');
    }, [goToProductPage, router]);

    const handleGoToProductPage = useCallback(() => setGoToProductPage(prev => !prev), []);

    return(
        <div className='mt-24 w-full h-full'>
            <ProductEditionForm useProductDataHandlers={ useProductDataHandlers } goToProductPage={ handleGoToProductPage } />
        </div>
    );
}
