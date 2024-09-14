import { FireBaseDocument, ProductBundleType, StateNewProductType, UseProductDataHandlers } from '@/app/utils/types';

import ProductEditionForm from '../ProductEditionForm';
// import { emptyProductBundleInitialState } from './emptyProductBundleInitialState';

interface DashboardProductEditionProps {
    product?:  StateNewProductType,
    useProductDataHandlers: UseProductDataHandlers;
    productFromFirebase: ProductBundleType & FireBaseDocument;
    setRefreshProducts: () => void;
}

export default function DashboardProductEdition({
    product,
    useProductDataHandlers,
    productFromFirebase,
    setRefreshProducts,
}: DashboardProductEditionProps) {
    return(
        <ProductEditionForm
            product={ product } 
            useProductDataHandlers={ useProductDataHandlers }
            productFromFirebase={ productFromFirebase }
            setRefreshProducts={ setRefreshProducts }
        />
    );
}