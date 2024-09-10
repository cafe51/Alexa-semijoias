'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType, StateNewProductType } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import DashboardProductDetails from './productPage/DashboardProductDetails';
import DashboardProductEdition from './productPage/DashboardProductEdition';
import { emptyProductBundleInitialState } from './productPage/emptyProductBundleInitialState';
import { initialEmptyState } from '@/app/hooks/useNewProductState';
import { useProductConverter } from '@/app/hooks/useProductConverter';
import ProductListItem from './productPage/ProductListItem';

export default function ProductsDashboard() {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [showEditionModal, setShowEditionModal] = useState<boolean>(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState<boolean>(false);
    const [productBundleEditable, setProductBundleEditable] = useState<StateNewProductType>(initialEmptyState);
    const [selectedProduct, setSelectedProduct] = useState< ProductBundleType & FireBaseDocument>(emptyProductBundleInitialState);
    const [refreshProducts, setRefreshProducts] = useState(false);

    const { useProductDataHandlers } = useProductConverter();

    const { getAllDocuments } = useCollection<ProductBundleType>('products');

    useEffect(() => {
        const fetchProducts = async() => {
            const res = await getAllDocuments([
                { field: 'updatingDate', order: 'desc' }, // Adiciona a opção de ordenação
            ]);
            setProducts(res);
        };
        fetchProducts();
    }, [refreshProducts]);

    useEffect(() => {
        setShowEditionModal(false);
    }, [refreshProducts]);

    useEffect(() => {
        if(selectedProduct.exist) {
            const editableProduct = useProductDataHandlers.finalTypeToEditableType(selectedProduct);
            setProductBundleEditable(editableProduct);
        }
    }, [selectedProduct]);

    return (
        <main className='w-full h-full'>
            <SlideInModal
                isOpen={ showEditionModal }
                closeModelClick={ () => setShowEditionModal(!showEditionModal)  }
                title="Editar Produto"
                fullWidth
            >
                { <DashboardProductEdition
                    product={ productBundleEditable }
                    useProductDataHandlers={ useProductDataHandlers }
                    productFromFirebase={ selectedProduct }
                    setRefreshProducts={ () => setRefreshProducts((prev) => !prev) }


                /> }
            </SlideInModal>
            <SlideInModal
                isOpen={ showProductDetailModal }
                closeModelClick={ () => setShowProductDetailModal(!showProductDetailModal) }
                title="Detalhes do produto"
                fullWidth
            >
                { <DashboardProductDetails product={ selectedProduct }/> }

            </SlideInModal>
            <section className='flex flex-col gap-2 w-full h-full'>
                {
                    products.length > 0 && products.map((product, index) => {
                        return (
                            <ProductListItem
                                key={ index }
                                index={ index }
                                product={ product }
                                setSelectedProduct={ setSelectedProduct }
                                setShowEditionModal={ setShowEditionModal }
                                setShowProductDetailModal={ setShowProductDetailModal }
                                showEditionModal={ showEditionModal }
                                showProductDetailModal={ showProductDetailModal }
                            />
                        );
                    })
                }
            </section>
        </main>
    );
}