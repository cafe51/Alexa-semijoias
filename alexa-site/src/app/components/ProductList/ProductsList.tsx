// app/components/ProductList/ProductsList.tsx
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import ProductsListClient from './ProductsListClient';

interface ProductsListProps {
    sectionName?: string;
    subsection?: string;
    searchTerm?: string;
    initialData?: {
        products: (ProductBundleType & FireBaseDocument)[];
        hasMore: boolean;
        lastVisible: string | null;
    };
}

export default function ProductsList({ 
    sectionName, 
    subsection, 
    searchTerm,
    initialData, 
}: ProductsListProps) {
    return (
        <ProductsListClient 
            sectionName={ sectionName }
            subsection={ subsection }
            searchTerm={ searchTerm }
            initialData={ initialData }
        />
    );
}
