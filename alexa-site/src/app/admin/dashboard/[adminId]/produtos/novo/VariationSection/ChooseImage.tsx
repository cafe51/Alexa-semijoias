import { ImageProductDataType, VariationProductType } from '@/app/utils/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface ChooseImageProps  {
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
    setShowChooseImageModel: Dispatch<SetStateAction<boolean>>;
    images: ImageProductDataType[];
    productVariation: VariationProductType;
    setImageIndex: Dispatch<SetStateAction<number>>;
}

export default function ChooseImage({
    handleUpdateProductVariation,
    setShowChooseImageModel,
    images,
    productVariation,
    setImageIndex,
    
}: ChooseImageProps) {
    const chooseImageClick = (imageSelectedLocalUrl: string) => {
        setShowChooseImageModel((prev) => !prev);
        const foundedImage = images.find((image) => image.localUrl === imageSelectedLocalUrl);
        setImageIndex(foundedImage ? foundedImage.index : 0);
        handleUpdateProductVariation(productVariation, {
            ...productVariation,
            defaultProperties: {
                ...productVariation.defaultProperties,
                imageIndex: foundedImage ? foundedImage.index : 0,
            },
        });
    };

    return (
        <div className='flex flex-wrap gap-4'>
            { images && images.map((image, i) => {
                return (
                    <div
                        className='w-[100px] rounded-lg relative h-[100px] overflow-hidden'
                        onClick={ () => chooseImageClick(image.localUrl) }
                        key={ i }
                    >
                        <Image
                            className='rounded-lg object-cover'
                            src={ image.localUrl }
                            alt={ `Foto da peça ${ i }` }
                            fill
                        />
                    </div>
                );
            }) }

        </div>

    );
}