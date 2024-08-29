import { FireBaseDocument, ProductBundleType, SectionType, StateNewProductType } from '@/app/utils/types';

import ProductEditionForm from '../ProductEditionForm';
// import { emptyProductBundleInitialState } from './emptyProductBundleInitialState';

interface DashboardProductEditionProps {
    product?:  StateNewProductType,
    useProductDataHandlers: {
        hasNoProductVariations: (editableProduct: StateNewProductType, imageUrls: string[], productId: string) => ProductBundleType;
        hasProductVariations: (editableProduct: StateNewProductType, imageUrls: string[], productId: string) => ProductBundleType;
        uploadAndGetAllImagesUrl: (images: {
            file?: File;
            localUrl: string;
        }[]) => Promise<string[]>;
        createAndUpdateSiteSections: (sectionsSiteState: never[] | (SectionType & {
            exist?: boolean;
            id?: string;
        })[]) => Promise<void>;
    }
    productFromFirebase: ProductBundleType & FireBaseDocument;

}

export default function DashboardProductEdition({ product, useProductDataHandlers, productFromFirebase }: DashboardProductEditionProps) {
    return(
        <ProductEditionForm product={ product }  useProductDataHandlers={ useProductDataHandlers } productFromFirebase={ productFromFirebase }/>
    );
}