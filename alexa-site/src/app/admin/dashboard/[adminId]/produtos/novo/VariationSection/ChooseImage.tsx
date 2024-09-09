import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { findImage } from '@/app/utils/findImage';
import { ImageProductDataType, VariationProductType } from '@/app/utils/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface ChooseImageProps  {
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
    setShowChooseImageModel: Dispatch<SetStateAction<boolean>>;
    images: ImageProductDataType[];
    productVariation: VariationProductType;
    setImageIndex: Dispatch<SetStateAction<number>>;
    imageIndex: number;
    showChooseImageModel: boolean;
}

export default function ChooseImage({
    handleUpdateProductVariation,
    setShowChooseImageModel,
    images,
    productVariation,
    setImageIndex,
    imageIndex,
    showChooseImageModel,
    
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
        <>
            { showChooseImageModel && <ModalMaker title='Escolha uma imagem' closeModelClick={ () => setShowChooseImageModel(!showChooseImageModel) }>
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
            </ModalMaker> }

            <div className='rounded-lg relative h-36 w-36 overflow-hidden flex-shrink-0' onClick={ () => setShowChooseImageModel((prev) => !prev) } >
                <Image
                    className='rounded-lg object-cover '
                    src={ findImage(images, imageIndex) }
                    alt="Foto da peça"
                    fill
                />
            </div>
        </>
    );
}