'use client';
import { useState } from 'react';
import { FireBaseDocument, ProductBundleType } from '../utils/types';
import ProductSorter, { SortOption } from '../components/ProductList/ProductSorter';
import ProductCard from '../components/ProductList/ProductCard';

interface ProductsListProps {
    productList: (ProductBundleType & FireBaseDocument)[];
}

export default function SearchProductsList({ productList }: ProductsListProps) {


    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'creationDate', 
        direction: 'desc', 
    });

    // const pedidosFiltrados = useMemo<FilterOptionForUseSnapshott[]>(() => {
    //     const baseFilters: FilterOptionForUseSnapshot[] = [
    //         { field: 'showProduct', operator: '==', value: true },
    //         { field: 'estoqueTotal', operator: '>', value: 0 },
    //     ];

    //     if (searchTerm) {
    //         return [
    //             ...baseFilters,
    //             { field: 'name', operator: '==', value: searchTerm.toLowerCase() },
    //             // { field: 'name', operator: '>=', value: searchTerm.toLowerCase() },
    //             // { field: 'name', operator: '<=', value: searchTerm.toLowerCase() + '\uf8ff' },
    //         ];
    //     }

    //     if (subsection) {
    //         return [
    //             ...baseFilters,
    //             { field: 'subsections', operator: 'array-contains', value: subsection },
    //         ];
    //     }

    //     if (sectionName) {
    //         return [
    //             ...baseFilters,
    //             { field: 'sections', operator: 'array-contains', value: sectionName },
    //         ];
    //     }

    //     return baseFilters;
    // }, [sectionName, subsection, searchTerm]);

    // // const orderByOption = useMemo(() => ({
    // //     field: currentSort.orderBy,
    // //     direction: currentSort.direction,
    // // }), [currentSort.orderBy, currentSort.direction]);


    // useEffect(() => {
    //     console.log('Filtros aplicados:', pedidosFiltrados);
    // }, [pedidosFiltrados]);

    // if (isLoading && !documents) return <LoadingIndicator />;

    // if (documents && documents.length <= 0) {
    //     if (searchTerm) {
    //         return <h1 className="text-center mt-8">Nenhum produto encontrado para &ldquo;{ searchTerm }&rdquo;</h1>;
    //     }
    //     return <h1 className="text-center mt-8">Ainda não há produtos nessa categoria</h1>;
    // }

    return (
        <main>
            { productList && productList.length > 0 && (
                <>
                    <ProductSorter
                        currentSort={ currentSort.value }
                        onSortChange={ (option) => setCurrentSort(option) }
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        { productList.map((productData) => (
                            <ProductCard key={ productData.id } product={ productData } />
                        )) }
                    </div>
                </>
            ) }
        </main>
    );
}