'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType, ProductVariationsType, StateNewProductType } from '@/app/utils/types';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import DashboardProductDetails from './productPage/DashboardProductDetails';
import DashboardProductEdition from './productPage/DashboardProductEdition';
import { emptyProductBundleInitialState } from './productPage/emptyProductBundleInitialState';
import { initialEmptyState } from '@/app/hooks/useNewProductState';
import { useProductConverter } from '@/app/hooks/useProductConverter';
import ProductListItem from './productPage/ProductListItem';
import ProductsHeader from './components/ProductsHeader';
import { usePagination } from '@/app/hooks/usePagination';
import Notification from '@/app/components/Notification';

const ITEMS_PER_PAGE = 10;

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
}

const useProductManagement = () => {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [refreshProducts, setRefreshProducts] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getAllDocuments } = useCollection<ProductBundleType>('products');

    useEffect(() => {
        const fetchProducts = async() => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getAllDocuments([
                    { field: 'updatingDate', order: 'desc' },
                ]);
                setProducts(res);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setError('Falha ao carregar produtos. Por favor, tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [refreshProducts]);

    return { products, setRefreshProducts, isLoading, error };
};

export default function ProductsDashboard() {
    const [showEditionModal, setShowEditionModal] = useState(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState(false);
    const [productBundleEditable, setProductBundleEditable] = useState<StateNewProductType>(initialEmptyState);
    const [selectedProduct, setSelectedProduct] = useState<ProductBundleType & FireBaseDocument>(emptyProductBundleInitialState);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const { products, setRefreshProducts, isLoading, error } = useProductManagement();
    const { useProductDataHandlers } = useProductConverter();
    const { deleteDocument: deleteProductBundle } = useCollection<ProductBundleType>('products');
    const { deleteDocument: deleteProductVariation, getAllDocuments: getAllProductVariations } = useCollection<ProductVariationsType>('productVariations');


    useEffect(() => {
        if (selectedProduct.exist) {
            const editableProduct = useProductDataHandlers.finalTypeToEditableType(selectedProduct);
            setProductBundleEditable(editableProduct);
        }
    }, [selectedProduct]);

    const handleRefresh = useCallback(() => setRefreshProducts(prev => !prev), []);

    const handleProductSelection = useCallback((product: ProductBundleType & FireBaseDocument) => {
        setSelectedProduct(product);
        setShowEditionModal(true);
    }, []);

    const handleProductDetail = useCallback((product: ProductBundleType & FireBaseDocument) => {
        setSelectedProduct(product);
        setShowProductDetailModal(true);
    }, []);

    const handleDelete = useCallback(async(id: string) => {
        try {
            const productVariationsFromCollection = await getAllProductVariations([{ field: 'productId', operator: '==', value: id }]);
            await Promise.all(productVariationsFromCollection.map((pv) => deleteProductVariation(pv.id)));
            await deleteProductBundle(id);
            handleRefresh();
            setNotification({ message: 'Produto excluído com sucesso', type: 'success' });
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            setNotification({ message: 'Falha ao excluir produto. Por favor, tente novamente.', type: 'error' });
        }
    }, [deleteProductBundle, handleRefresh, deleteProductVariation, getAllProductVariations]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [products, searchQuery]);

    const { currentPage, setCurrentPage, paginatedItems, totalPages } = usePagination({
        items: filteredProducts,
        itemsPerPage: ITEMS_PER_PAGE,
    });

    const handleProductEdited = useCallback(() => {
        setShowEditionModal(false);
        handleRefresh();
    }, [handleRefresh]);

    return (
        <main className='w-full h-full mt-24'>
            <ProductsHeader totalProducts={ products.length } onSearch={ handleSearch } />
            <SlideInModal
                isOpen={ showEditionModal }
                closeModelClick={ () => setShowEditionModal(false) }
                title="Editar Produto"
                fullWidth
            >
                <DashboardProductEdition
                    product={ productBundleEditable }
                    useProductDataHandlers={ useProductDataHandlers }
                    productFromFirebase={ selectedProduct }
                    setRefreshProducts={ handleProductEdited }
                />
            </SlideInModal>
            <SlideInModal
                isOpen={ showProductDetailModal }
                closeModelClick={ () => setShowProductDetailModal(false) }
                title="Detalhes do produto"
                fullWidth
            >
                <DashboardProductDetails product={ selectedProduct } />
            </SlideInModal>
            <section className='flex flex-col gap-2 w-full h-full'>
                { isLoading ? (
                    <div className="text-center py-4">Carregando produtos...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{ error }</div>
                ) : paginatedItems.length > 0 ? (
                    paginatedItems.map((product) => (
                        <ProductListItem
                            key={ product.id }
                            product={ product }
                            setSelectedProduct={ handleProductSelection }
                            setShowProductDetailModal={ handleProductDetail }
                            deleteDocument={ handleDelete }
                            setRefreshProducts={ handleRefresh }
                        />
                    ))
                ) : (
                    <div className="text-center py-4">Nenhum produto encontrado.</div>
                ) }
            </section>
            { totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    { Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={ page }
                            onClick={ () => setCurrentPage(page) }
                            className={ `mx-1 px-3 py-1 rounded ${
                                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }` }
                        >
                            { page }
                        </button>
                    )) }
                </div>
            ) }
            { notification && (
                <Notification
                    message={ notification.message }
                    type={ notification.type }
                    onClose={ () => setNotification(null) }
                />
            ) }
        </main>
    );
}