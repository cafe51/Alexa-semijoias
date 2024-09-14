// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useProductConverter } from '@/app/hooks/useProductConverter';
import ProductEditionForm from '../ProductEditionForm';

export default function NewProductPage() {
    const { useProductDataHandlers } = useProductConverter();
    return(
        <ProductEditionForm useProductDataHandlers={ useProductDataHandlers }/>
    );
}
