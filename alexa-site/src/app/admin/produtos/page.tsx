// src/app/admin/produtos/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FireBaseDocument, ProductBundleType, SectionType, StateNewProductType } from '@/app/utils/types';
import { emptyProductBundleInitialState } from './productPage/emptyProductBundleInitialState';
import { initialEmptyState } from '@/app/hooks/useNewProductState';
import { useProductConverter } from '@/app/hooks/useProductConverter';
import ProductListItem from './productPage/ProductListItem';
import { useCollection } from '@/app/hooks/useCollection';
import useFirebaseUpload from '@/app/hooks/useFirebaseUpload';
import Notification from '@/app/components/Notification';
import { useProductPagination } from '@/app/hooks/useProductPagination';
import { Pagination } from '@/app/components/Pagination';
import ProductSorter from '@/app/components/ProductList/ProductSorter';
import ProductPageModals from './ProductPageModals';
import ProductFilters from './ProductFilters';
import ProductsHeader from './components/ProductsHeader';

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function ProductsDashboard() {
    const [showEditionModal, setShowEditionModal] = useState(false);
    const [showCreateNewProductModal, setShowCreateNewProductModal] = useState(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState(false);
    const [productBundleEditable, setProductBundleEditable] = useState<StateNewProductType>(initialEmptyState);
    const [selectedProduct, setSelectedProduct] = useState<ProductBundleType & FireBaseDocument>(emptyProductBundleInitialState);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [showProductQuantitiesModal, setShowProductQuantitiesModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [siteSections, setSiteSections] = useState<(SectionType & FireBaseDocument)[]>([]);

    const { 
        products, 
        isLoading, 
        error, 
        currentPage, 
        totalPages, 
        totalDocuments,
        currentSort,
        goToPage, 
        onSortChange,
        refresh,
        setSearchTerm,
        searchTerm,
        showStoreProducts,
        setShowStoreProducts,
        showOutStoreProducts,
        setShowOutStoreProducts,
        estoqueRange,
        setEstoqueRange,
        priceRange,
        setPriceRange,
        selectedSection,
        setSelectedSection,
        selectedSubsection,
        setSelectedSubsection,
    } = useProductPagination();
    
    const { useProductDataHandlers } = useProductConverter();
    const { deleteDocument: deleteProductBundle, getDocumentById: getProductById } = useCollection<ProductBundleType>('products');
    const { deleteImage } = useFirebaseUpload();
    const { deleteDocument: deleteProductVariation, getAllDocuments: getAllProductVariations } = useCollection<ProductBundleType>('productVariations');
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');

    useEffect(() => {
        const fetchSections = async() => {
            const sections = await getAllSections();
            setSiteSections(sections);
        };
        fetchSections();
    }, []);

    useEffect(() => {
        if (selectedProduct.exist) {
            const editableProduct = useProductDataHandlers.finalTypeToEditableType(selectedProduct);
            setProductBundleEditable(editableProduct);
        }
    }, [selectedProduct]);

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
            const product = await getProductById(id);
            if (!product.exist) {
                throw new Error('Produto não encontrado');
            }
            const deleteImagePromises = product.images.map(image => deleteImage(image.localUrl));
            await Promise.all(deleteImagePromises);
            const productVariationsFromCollection = await getAllProductVariations([{ field: 'productId', operator: '==', value: id }]);
            await Promise.all(productVariationsFromCollection.map((pv) => deleteProductVariation(pv.id)));
            await deleteProductBundle(id);
            refresh();
            setNotification({ message: 'Produto excluído com sucesso', type: 'success' });
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            setNotification({ message: 'Falha ao excluir produto. Por favor, tente novamente.', type: 'error' });
        }
    }, [deleteProductBundle, refresh, deleteProductVariation, getAllProductVariations, getProductById, deleteImage]);

    const handleProductEdited = useCallback(() => {
        setShowEditionModal(false);
        setShowCreateNewProductModal(false);
        refresh();
    }, [refresh]);

    return (
        <main className="md:m-auto md:mt-24 md:w-2/3 lg:w-1/2 mt-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#FAF9F6]">
            <ProductsHeader
                totalProducts={ totalDocuments }
                setSearchTerm={ (searchTerm: string) => setSearchTerm(searchTerm) }
                searchTerm={ searchTerm }
                showProductQuantitiesModal={ () => setShowProductQuantitiesModal(true) }
                setShowCreateNewProductModal={ () => setShowCreateNewProductModal(true) }
                selectedSection={ selectedSection }
                selectedSubsection={ selectedSubsection }
            /> 
            <section className="flex justify-between items-center mb-4 gap-4">
                <ProductSorter
                    currentSort={ currentSort }
                    onSortChange={ onSortChange }
                />
                <ProductFilters
                    showStoreProducts={ showStoreProducts }
                    setShowStoreProducts={ setShowStoreProducts }
                    showOutStoreProducts={ showOutStoreProducts }
                    setShowOutStoreProducts={ setShowOutStoreProducts }
                    estoqueRange={ estoqueRange }
                    setEstoqueRange={ setEstoqueRange }
                    priceRange={ priceRange }
                    setPriceRange={ setPriceRange }
                    setShowFilterModal={ (showFilterModal: boolean) => setShowFilterModal(showFilterModal) }
                    showFilterModal={ showFilterModal }
                    selectedSection={ selectedSection }
                    setSelectedSection={ setSelectedSection }
                    selectedSubsection={ selectedSubsection }
                    setSelectedSubsection={ setSelectedSubsection }
                    siteSections={ siteSections }
                />
            </section>
            <section className="flex flex-col gap-4 w-full">
                { isLoading && products.length === 0 ? (
                    <div className="text-center py-4 text-[#333333]">Carregando produtos...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{ error }</div>
                ) : products.length > 0 ? (
                    <>
                        { products.map((product) => (
                            <ProductListItem
                                key={ product.id }
                                product={ product }
                                setSelectedProduct={ handleProductSelection }
                                setShowProductDetailModal={ handleProductDetail }
                                deleteDocument={ handleDelete }
                                setRefreshProducts={ refresh }
                            />
                        )) }
                        <Pagination
                            currentPage={ currentPage }
                            totalPages={ totalPages }
                            onPageChange={ goToPage }
                        />
                    </>
                ) : (
                    <div className="text-center py-4 text-[#333333]">Nenhum produto encontrado.</div>
                ) }
            </section>
            { notification && (
                <Notification
                    message={ notification.message }
                    type={ notification.type }
                    onClose={ () => setNotification(null) }
                />
            ) }
            <ProductPageModals
                showProductQuantitiesModal={ showProductQuantitiesModal }
                setShowProductQuantitiesModal={ (showProductQuantitiesModal: boolean) => setShowProductQuantitiesModal(showProductQuantitiesModal) }
                productBundleEditable={ productBundleEditable }
                selectedProduct={ selectedProduct }
                showEditionModal={ showEditionModal }
                setShowEditionModal={ (showEditionModal: boolean) => setShowEditionModal(showEditionModal) }
                showCreateNewProductModal={ showCreateNewProductModal }
                setShowCreateNewProductModal={ (showCreateNewProductModal: boolean) => setShowCreateNewProductModal(showCreateNewProductModal) }
                showProductDetailModal={ showProductDetailModal }
                setShowProductDetailModal={ (showProductDetailModal: boolean) => setShowProductDetailModal(showProductDetailModal) }
                handleProductEdited={ handleProductEdited }
                useProductDataHandlers={ useProductDataHandlers }
                siteSections={ siteSections }
            />
        </main>
    );
}
