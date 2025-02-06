// src/app/section/page.tsx
export const dynamic = 'force-dynamic';

import { getProductsForSection } from '@/app/firebase/admin-config';
import ProductsList from '../components/ProductList/ProductsList';
import SectionPageTitle from './SectionPageTitle';
import PageContainer from '@/app/components/PageContainer';

export default async function Section() {
    // Busca inicial dos produtos no servidor
    const { products, hasMore, lastVisible } = await getProductsForSection(
        undefined,
        10,
        { field: 'creationDate', direction: 'desc' },
    );
    
    return (
        <PageContainer>
            <SectionPageTitle section="produtos" />
            <ProductsList 
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
