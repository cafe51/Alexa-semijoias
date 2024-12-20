import blankImage from '../../../public/blankImage.png';
import { ImageProductDataType } from './types';

export const findImage = (images: ImageProductDataType[], index: number) => {
    const imageFounded = images.find((image) => image.index === index);
    if(imageFounded) {
        return imageFounded.localUrl;
    }
    return blankImage;
};