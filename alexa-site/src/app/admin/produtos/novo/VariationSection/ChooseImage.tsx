import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { ImageProductDataType } from '@/app/utils/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import blankImage from '../../../../../../public/blankImage.png';


export const findImageByIndex = (images: ImageProductDataType[], index: number) => {
    const imageFounded = images.find((image) => image.index === index);
    if(imageFounded) {
        return imageFounded.localUrl;
    }
    return blankImage;
};

interface ChooseImageProps  {
    setShowChooseImageModel: Dispatch<SetStateAction<boolean>>;
    images: ImageProductDataType[];
    imageIndex: number;
    showChooseImageModel: boolean;
    handleImageChange: (foundedImage: ImageProductDataType | undefined) => void;
}

export default function ChooseImage({
    setShowChooseImageModel,
    images,
    handleImageChange,
    imageIndex,
    showChooseImageModel,
    
}: ChooseImageProps) {

    const chooseImageClick = (imageSelectedLocalUrl: string) => {
        setShowChooseImageModel((prev) => !prev);
        const foundedImage = images.find((image) => image.localUrl === imageSelectedLocalUrl);
        handleImageChange(foundedImage);
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
                    src={ findImageByIndex(images, imageIndex) }
                    alt="Foto da peça"
                    fill
                />
            </div>
        </>
    );
}