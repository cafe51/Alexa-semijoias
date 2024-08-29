import { VariationProductType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../../../../../public/blankImage.jpg';
import { useState } from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';

function FilledField({ propertyName, propertyValue, wFull=false }: {propertyName: string, propertyValue: string | number, wFull?: boolean}) {
    return (
        <div className={ `flex flex-col gap-1 ${wFull ? 'flex-grow' : 'w-20'}` }>
            <label className="text-xs font-small" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
            <div className={ `flex items-center justify-center ${wFull ? 'flex-grow' : 'w-11'} h-8 text-center text-xs px-3 border rounded-md bg-green-600` }>
                <p className='text-white'>{ propertyValue }</p>

            </div>
        </div>
    );
}

function ChooseImage({ image, handleClick, i }: { image: string, handleClick: (image: string) => void, i: number }) {
    return (
        <div
            className='w-[100px] rounded-lg relative h-[100px] overflow-hidden'
            onClick={ () => handleClick(image) }
        >
            <Image
                className='rounded-lg object-cover '
                src={ image }
                alt={ `Foto da peça ${ i }` }
                fill
            />
        </div>
    );
}

interface VariationFieldInputFilledProps {
    productVariation: VariationProductType;
    images: string[] | null;
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;

}

export default function VariationFieldInputFilled({ productVariation, images, handleUpdateProductVariation }: VariationFieldInputFilledProps) {
    const { customProperties, defaultProperties } = productVariation;
    // const [imageIndex, setImageIndex] = useState(0);
    const [showChooseImageModel, setShowChooseImageModel] = useState<boolean>(false);

    const estoqueAndPeso = [
        { propertyName: 'estoque', propertyValue: defaultProperties.estoque },
        { propertyName: 'peso', propertyValue: defaultProperties.peso },
    ];

    const barCodeAndSku = [
        { propertyName: 'código de barras', propertyValue: defaultProperties.barcode },
        { propertyName: 'sku', propertyValue: defaultProperties.sku },
    ];

    const chooseImageClick = (image: string) => {
        // console.log(images.indexOf(image));
        // setImageIndex(images.indexOf(image));
        setShowChooseImageModel(!showChooseImageModel);
        handleUpdateProductVariation(productVariation, {
            ...productVariation,
            defaultProperties: {
                ...productVariation.defaultProperties,
                imageIndex: images!.indexOf(image),
            },
        });
    };


    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex gap-4 justify-evenly w-full'>
                { showChooseImageModel && <ModalMaker title='Escolha uma imagem' closeModelClick={ () => setShowChooseImageModel(!showChooseImageModel) }>
                    <div className='flex flex-wrap gap-4'>
                        { images && images.map((image, i) => <ChooseImage key={ i } image={ image } handleClick={ chooseImageClick } i={ i }/>) }
                    </div>

                </ModalMaker> }

                <div className='rounded-lg relative h-36 w-36 overflow-hidden flex-shrink-0' onClick={ () => setShowChooseImageModel(!showChooseImageModel) } >
                    <Image
                        className='rounded-lg object-cover '
                        src={ images ? images[productVariation.defaultProperties.imageIndex ? productVariation.defaultProperties.imageIndex : 0] : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>

                <div className='flex flex-col gap-2 flex-grow '>
                    {
                        Object.keys(customProperties)
                            .map((property, index) => {
                                const value = customProperties[property as keyof typeof customProperties];
                                if(property in customProperties) {
                                    return <FilledField key={ index } propertyName={ property } propertyValue={ value } wFull={ true }/>;
                                }
                            })
                    }
                </div>
            </div>
            

            <section className='flex flex-col gap-4 p-2 w-full rounded-lg'>
                <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-green-400'>
                    {
                        estoqueAndPeso.map(({ propertyName, propertyValue }, i) => {
                            return <FilledField key={ i } propertyName={ propertyName } propertyValue={ propertyValue } />;
                        })
                    }
                    {
                        Object.keys(defaultProperties.dimensions)
                            .map((property, index) => {
                                if(property in defaultProperties.dimensions) {
                                    const value = defaultProperties.dimensions[property as keyof typeof defaultProperties.dimensions];
                                    return <FilledField key={ index } propertyName={ property } propertyValue={ value }/>;
                                }
                            }) }

                    {
                        barCodeAndSku.map(({ propertyName, propertyValue }, i) => {
                            return(
                                <div key={ i } className='w-full ml-2'>
                                    <FilledField  propertyName={ propertyName } propertyValue={ propertyValue } wFull={ true }/>
                                </div>
                            );
                        })
                    }
                </div>

            </section>
        </div>

    );
}
