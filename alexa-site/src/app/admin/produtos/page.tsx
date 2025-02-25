// src/app/admin/produtos/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FireBaseDocument, ProductBundleType, ProductVariationsType, SectionType, StateNewProductType } from '@/app/utils/types';
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
import MultiSelectModal from './components/MultiSelectModal';
import MassDeleteConfirmationModal from './components/MassDeleteConfirmationModal';
import MassDeleteErrorModal from './components/MassDeleteErrorModal';
// Novos modais para modificação em massa:
import MassModifyModal from './components/MassModifyModal';
import MassModifyConfirmationModal from './components/MassModifyConfirmationModal';
import MassModifyErrorModal from './components/MassModifyErrorModal';
import adjustPriceTo99 from '@/app/utils/adjustPriceTo99';

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function ProductsDashboard() {
    // Estados já existentes
    const [showEditionModal, setShowEditionModal] = useState(false);
    const [showCreateNewProductModal, setShowCreateNewProductModal] = useState(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState(false);
    const [productBundleEditable, setProductBundleEditable] = useState<StateNewProductType>(initialEmptyState);
    const [selectedProduct, setSelectedProduct] = useState<ProductBundleType & FireBaseDocument>(emptyProductBundleInitialState);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [showProductQuantitiesModal, setShowProductQuantitiesModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [siteSections, setSiteSections] = useState<(SectionType & FireBaseDocument)[]>([]);

    // Estados para o modo de multiseleção
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [isDeletingMass, setIsDeletingMass] = useState(false);
    const [showMassDeleteConfirmation, setShowMassDeleteConfirmation] = useState(false);
    // Estados para erros na deleção em massa
    const [failedDeletions, setFailedDeletions] = useState<{ productName: string, error: string }[]>([]);
    const [showMassDeleteErrorModal, setShowMassDeleteErrorModal] = useState(false);

    // Novos estados para modificação em massa
    const [showMassModifyModal, setShowMassModifyModal] = useState(false);
    const [showMassModifyConfirmation, setShowMassModifyConfirmation] = useState(false);
    const [showMassModifyErrorModal, setShowMassModifyErrorModal] = useState(false);
    const [isModifyingMass, setIsModifyingMass] = useState(false);
    const [massModifyOptions, setMassModifyOptions] = useState<{
        showProduct: boolean | null;
        lancamento: boolean | null;
        removePromotion: boolean;
        priceModification: {
            value: number | null;
            type: 'percentual' | 'fixo' | null;
            operation: 'increase' | 'decrease' | null;
        }
    }>({
        showProduct: null,
        lancamento: null,
        removePromotion: false,
        priceModification: {
            value: null,
            type: null,
            operation: null,
        },
    });
    const [failedMassModifications, setFailedMassModifications] = useState<{ productName: string, error: string }[]>([]);

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
        itemsPerPage,
        setItemsPerPage,
        setShowLancamento,
        showLancamento,
        setShowPromotional,
        showPromotional,
    } = useProductPagination();
    
    const { useProductDataHandlers } = useProductConverter();
    // Incluímos o updateDocumentField para as atualizações
    const { 
        deleteDocument: deleteProductBundle, 
        getDocumentById: getProductById,
        updateDocumentField,
    } = useCollection<ProductBundleType>('products');
    const { deleteImage } = useFirebaseUpload();
    const { deleteDocument: deleteProductVariation, getAllDocuments: getAllProductVariations } = useCollection<ProductVariationsType>('productVariations');
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
        if (!multiSelectMode) {
            setSelectedProduct(product);
            setShowEditionModal(true);
        }
    }, [multiSelectMode]);

    const handleProductDetail = useCallback((product: ProductBundleType & FireBaseDocument) => {
        if (!multiSelectMode) {
            setSelectedProduct(product);
            setShowProductDetailModal(true);
        }
    }, [multiSelectMode]);

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

    // Handlers para o modo de multiseleção
    const handleActivateMultiSelect = useCallback((product: ProductBundleType & FireBaseDocument) => {
        setMultiSelectMode(true);
        setSelectedProducts([product]);
    }, []);

    const handleToggleSelect = useCallback((product: ProductBundleType & FireBaseDocument) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    }, []);

    const handleCancelMultiSelect = useCallback(() => {
        setMultiSelectMode(false);
        setSelectedProducts([]);
    }, []);

    // Função de deleção em massa (já existente)
    const handleMassDelete = useCallback(async() => {
        setIsDeletingMass(true);
        const localFailedDeletions: { productName: string, error: string }[] = [];
        const batchSize = 5; // quantidade de deleções concorrentes

        for (let i = 0; i < selectedProducts.length; i += batchSize) {
            const batch = selectedProducts.slice(i, i + batchSize);
            await Promise.all(batch.map(async(product) => {
                try {
                    const prod = await getProductById(product.id);
                    if (!prod.exist) {
                        throw new Error('Produto não encontrado');
                    }
                    const deleteImagePromises = prod.images.map(image => deleteImage(image.localUrl));
                    await Promise.all(deleteImagePromises);
                    const productVariationsFromCollection = await getAllProductVariations([{ field: 'productId', operator: '==', value: product.id }]);
                    await Promise.all(productVariationsFromCollection.map((pv) => deleteProductVariation(pv.id)));
                    await deleteProductBundle(product.id);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    localFailedDeletions.push({ productName: product.name, error: errorMessage });
                }
            }));
        }
        refresh();
        setMultiSelectMode(false);
        setSelectedProducts([]);
        if (localFailedDeletions.length > 0) {
            setFailedDeletions(localFailedDeletions);
        } else {
            setNotification({ message: 'Produtos excluídos com sucesso', type: 'success' });
        }
        setIsDeletingMass(false);
        setShowMassDeleteConfirmation(false);
        if (localFailedDeletions.length > 0) {
            setShowMassDeleteErrorModal(true);
        }
    }, [selectedProducts, getProductById, deleteImage, getAllProductVariations, deleteProductVariation, deleteProductBundle, refresh]);

    const handleSelectAll = useCallback(() => {
        setSelectedProducts(products);
    }, [products]);

    // FUNÇÃO DE MODIFICAÇÃO EM MASSA
    const handleMassModify = useCallback(async() => {
        setIsModifyingMass(true);
        const localFailedUpdates: { productName: string, error: string }[] = [];
        const batchSize = 5;
    
        // Ordena os produtos selecionados por updatingDate (dos mais antigos para os mais recentes)
        const sortedProducts = [...selectedProducts].sort((a, b) => {
            // a.updatingDate e b.updatingDate são Timestamps; convertemos para Date para a comparação
            const dateA = a.updatingDate.toDate().getTime();
            const dateB = b.updatingDate.toDate().getTime();
            return dateA - dateB;
        });
    
        for (let i = 0; i < sortedProducts.length; i += batchSize) {
            const batch = sortedProducts.slice(i, i + batchSize);
            await Promise.all(batch.map(async(product) => {
                try {
                    const prod = await getProductById(product.id);
                    if (!prod.exist) {
                        throw new Error('Produto não encontrado');
                    }
                    // Usamos "const" para o objeto de updates
                    const updates: { [key: string]: any } = {};
                    let shouldUpdate = false;
                    // Atualiza showProduct se necessário
                    if (massModifyOptions.showProduct !== null && prod.showProduct !== massModifyOptions.showProduct) {
                        updates['showProduct'] = massModifyOptions.showProduct;
                        shouldUpdate = true;
                    }
                    // Atualiza lancamento se necessário
                    if (massModifyOptions.lancamento !== null && prod.lancamento !== massModifyOptions.lancamento) {
                        updates['lancamento'] = massModifyOptions.lancamento;
                        shouldUpdate = true;
                    }
                    // Remove promoção se solicitado
                    if (massModifyOptions.removePromotion && prod.value.promotionalPrice !== 0) {
                        const newProductVariations = prod.productVariations.map(variation => ({
                            ...variation,
                            value: {
                                ...variation.value,
                                promotionalPrice: 0,
                            },
                        }));
                        updates['productVariations'] = newProductVariations;
                        updates['value.promotionalPrice'] = 0;
                        updates['finalPrice'] = prod.value.price;
                        updates['promotional'] = false;
                        shouldUpdate = true;
                    }
                    // Atualiza preço se houver modificação configurada e se o valor foi informado
                    if (
                        massModifyOptions.priceModification &&
                      massModifyOptions.priceModification.value !== null &&
                      !isNaN(massModifyOptions.priceModification.value)
                    ) {
                        const { value, type, operation } = massModifyOptions.priceModification;
                        let newPrice: number = prod.value.price;
                        if (type === 'fixo') {
                            if (operation === 'increase') {
                                newPrice = prod.value.price + value;
                            } else if (operation === 'decrease') {
                                newPrice = prod.value.price - value;
                                if (newPrice < 0) newPrice = 0;
                            }
                        } else if (type === 'percentual') {
                            if (operation === 'increase') {
                                newPrice = prod.value.price + (prod.value.price * (value / 100));
                            } else if (operation === 'decrease') {
                                newPrice = prod.value.price - (prod.value.price * (value / 100));
                                if (newPrice < 0) newPrice = 0;
                            }
                            newPrice = adjustPriceTo99(newPrice);

                        }
                        if (newPrice !== prod.value.price) {
                            const newProductVariations = prod.productVariations.map(variation => ({
                                ...variation,
                                value: {
                                    ...variation.value,
                                    price: newPrice,
                                },
                            }));
                            const finalPrice = product.value.promotionalPrice ? product.value.promotionalPrice : newPrice;
                            updates['value.price'] = newPrice;
                            updates['productVariations'] = newProductVariations;
                            updates['finalPrice'] = finalPrice;

                            shouldUpdate = true;
                        }
                    }
                    if (shouldUpdate) {
                        // Atualiza o campo updatingDate com a data atual
                        updates['updatingDate'] = new Date();
                        const updatePromises = Object.keys(updates).map(key =>
                            updateDocumentField(product.id, key, updates[key]),
                        );
                        await Promise.all(updatePromises);
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    localFailedUpdates.push({ productName: product.name, error: errorMessage });
                }
            }));
        }
        refresh();
        setMultiSelectMode(false);
        setSelectedProducts([]);
        if (localFailedUpdates.length > 0) {
            setFailedMassModifications(localFailedUpdates);
            setShowMassModifyErrorModal(true);
        } else {
            setNotification({ message: 'Produtos modificados com sucesso', type: 'success' });
        }
        setIsModifyingMass(false);
        setShowMassModifyConfirmation(false);
    }, [selectedProducts, massModifyOptions, getProductById, updateDocumentField, refresh]);
    
    
    

    return (
        <main className="md:m-auto md:w-3/4 px-0 md:px-8 lg:px-12 bg-[#FAF9F6]">
            <ProductsHeader
                totalProducts={ totalDocuments }
                setSearchTerm={ (searchTerm: string) => setSearchTerm(searchTerm) }
                searchTerm={ searchTerm }
                showProductQuantitiesModal={ () => setShowProductQuantitiesModal(true) }
                setShowCreateNewProductModal={ () => setShowCreateNewProductModal(true) }
                selectedSection={ selectedSection }
                selectedSubsection={ selectedSubsection }
                itemsPerPage={ itemsPerPage }
                setItemsPerPage={ setItemsPerPage }
                disablePaginationSizeChange={ multiSelectMode }
            /> 
            <section className="flex justify-between items-center mb-4 gap-4">
                <ProductSorter
                    currentSort={ currentSort }
                    onSortChange={ onSortChange }
                    disableSortChange={ multiSelectMode }
                />
                <ProductFilters
                    setShowLancamento={ setShowLancamento }
                    showLancamento={ showLancamento }
                    setShowPromotional={ setShowPromotional }
                    showPromotional={ showPromotional }
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
                    disableFilterChange={ multiSelectMode }
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
                                multiSelectMode={ multiSelectMode }
                                isSelected={ selectedProducts.some(p => p.id === product.id) }
                                onActivateMultiSelect={ handleActivateMultiSelect }
                                onToggleSelect={ handleToggleSelect }
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
            { multiSelectMode && (
                <MultiSelectModal
                    isOpen={ multiSelectMode }
                    selectedCount={ selectedProducts.length }
                    onCancel={ handleCancelMultiSelect }
                    onDelete={ () => setShowMassDeleteConfirmation(true) }
                    onSelectAll={ handleSelectAll }
                    onModify={ () => setShowMassModifyModal(true) }
                    isDeleting={ isDeletingMass }
                />
            ) }
            { showMassDeleteConfirmation && (
                <MassDeleteConfirmationModal
                    isOpen={ showMassDeleteConfirmation }
                    onClose={ () => setShowMassDeleteConfirmation(false) }
                    onConfirm={ handleMassDelete }
                    isDeleting={ isDeletingMass }
                />
            ) }
            { showMassDeleteErrorModal && (
                <MassDeleteErrorModal
                    isOpen={ showMassDeleteErrorModal }
                    errorItems={ failedDeletions }
                    onClose={ () => setShowMassDeleteErrorModal(false) }
                />
            ) }
            { showMassModifyModal && (
                <MassModifyModal
                    onClose={ () => setShowMassModifyModal(false) }
                    onConfirm={ (options) => {
                        setMassModifyOptions(options);
                        setShowMassModifyModal(false);
                        setShowMassModifyConfirmation(true);
                    } }
                />
            ) }
            { showMassModifyConfirmation && (
                <MassModifyConfirmationModal
                    isModifying={ isModifyingMass }
                    modifications={ massModifyOptions }
                    selectedCount={ selectedProducts.length }
                    onClose={ () => setShowMassModifyConfirmation(false) }
                    onConfirm={ handleMassModify }
                />
            ) }
            { showMassModifyErrorModal && (
                <MassModifyErrorModal
                    isOpen={ showMassModifyErrorModal }
                    errorItems={ failedMassModifications }
                    onClose={ () => setShowMassModifyErrorModal(false) }
                />
            ) }
        </main>
    );
}
