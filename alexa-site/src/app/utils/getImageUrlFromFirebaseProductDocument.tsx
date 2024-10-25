import blankImage from '@/../public/blankImage.png';
import { ProductBundleType } from './types';

export function getImageUrlFromFirebaseProductDocument(product: ProductBundleType | null) {
    if(product && product.images && product.images[0]) {
        return product.images[0].localUrl;
    } else {
        return blankImage;
    }
}