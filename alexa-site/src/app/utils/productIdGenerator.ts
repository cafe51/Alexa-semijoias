import { FireBaseDocument, ProductBundleType } from './types';

export const productIdGenerator = (
    productFromFirebase?: (ProductBundleType & FireBaseDocument),
    barcodeFromSimpleProduct?: string,
    barCodeFromProductVariation?: string,
) => {
    let productId: string;
    if(productFromFirebase && productFromFirebase.exist && productFromFirebase.id) {
        productId = productFromFirebase.id;
    } else {
        if(barcodeFromSimpleProduct && barcodeFromSimpleProduct.length > 1) {
            productId = barcodeFromSimpleProduct;
        } else {
            productId = barCodeFromProductVariation ? barCodeFromProductVariation : '78902166' + (Math.floor(Math.random() * 9000) + 1000).toString();

        }
    }
    return productId;
};