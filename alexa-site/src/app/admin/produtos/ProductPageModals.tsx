import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import ProductEditionForm from './ProductEditionForm';
import ProductQuantitiesList from './ProductQuantitiesList';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import DashboardProductDetails from './productPage/DashboardProductDetails';
import { FireBaseDocument, ProductBundleType, SectionType, StateNewProductType, UseProductDataHandlers } from '@/app/utils/types';

interface ProductPageModalsProps {
    showProductQuantitiesModal: boolean;
    setShowProductQuantitiesModal: (showProductQuantitiesModal: boolean) => void;
    productBundleEditable: StateNewProductType;
    selectedProduct: ProductBundleType & FireBaseDocument;
    showEditionModal: boolean;
    setShowEditionModal: (showEditionModal: boolean) => void;
    showCreateNewProductModal: boolean;
    setShowCreateNewProductModal: (showCreateNewProductModal: boolean) => void;
    showProductDetailModal: boolean;
    setShowProductDetailModal: (showProductDetailModal: boolean) => void;
    handleProductEdited: () => void;
    useProductDataHandlers: UseProductDataHandlers;
    siteSections: (SectionType & FireBaseDocument)[];
}

export default function ProductPageModals({
    showProductQuantitiesModal,
    setShowProductQuantitiesModal,
    productBundleEditable,
    selectedProduct,
    showEditionModal,
    setShowEditionModal,
    showCreateNewProductModal,
    setShowCreateNewProductModal,
    showProductDetailModal,
    setShowProductDetailModal,
    handleProductEdited,
    useProductDataHandlers,
    siteSections,
}: ProductPageModalsProps,
) {
    return (
        <>
            {
                showProductQuantitiesModal && <ModalMaker
                    closeModelClick={ () => setShowProductQuantitiesModal(false) }
                    title="Quantidades de Produtos"
                >
                    {
                        siteSections && siteSections.length > 0 &&
                <ProductQuantitiesList siteSections={ siteSections } />
                    }
                </ModalMaker>
            }

            { /* Renderiza o modal somente quando ele estiver aberto, garantindo que o formulário seja desmontado ao fechar */ }
            { showEditionModal && (
                <SlideInModal
                    isOpen={ showEditionModal }
                    closeModelClick={ () => setShowEditionModal(false) }
                    title="Editar Produto"
                >
                    <ProductEditionForm
                        // Usamos uma key baseada no id do produto para forçar a reinicialização do componente
                        key={ selectedProduct.id }
                        product={ productBundleEditable }
                        useProductDataHandlers={ useProductDataHandlers }
                        productFromFirebase={ selectedProduct }
                        setRefreshProducts={ handleProductEdited }
                    />
                </SlideInModal>
            ) }

            { showCreateNewProductModal && (
                <SlideInModal
                    isOpen={ showCreateNewProductModal }
                    closeModelClick={ () => setShowCreateNewProductModal(false) }
                    title="Criar Novo Produto"
                >
                    <ProductEditionForm
                        key="new"
                        useProductDataHandlers={ useProductDataHandlers }
                        goToProductPage={ handleProductEdited }
                    />
                </SlideInModal>
            ) }

            <SlideInModal
                slideDirection='left'
                isOpen={ showProductDetailModal }
                closeModelClick={ () => setShowProductDetailModal(false) }
                title="Detalhes do produto"
            >
                <DashboardProductDetails product={ selectedProduct } />
            </SlideInModal>
        </>
    );
}