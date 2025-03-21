import blankImage from '@/../public/blankImage.png';
import { ProductBundleType } from './types';

export function getImageUrlFromFirebaseProductDocument(product: ProductBundleType | null | undefined, index: number = 0): string {
    if(product && product.images && product.images.length > 0) {
        if(!product.images[index]) {
            return product.images[0].localUrl;
        }
        if(index === -1) {
            return product.images[product.images.length - 1].localUrl;
        }
        return product.images[index].localUrl;
    } else {
        return blankImage.src;
    }
}
