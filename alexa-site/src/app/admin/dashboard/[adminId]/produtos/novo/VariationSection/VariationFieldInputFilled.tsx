// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationFieldInputFilled.tsx
import { ImageProductDataType, VariationProductType } from '@/app/utils/types';
import { useState } from 'react';
import ChooseImage from './ChooseImage';

function FilledField({ propertyName, propertyValue, wFull=false }: {propertyName: string, propertyValue: string | number, wFull?: boolean}) {
    return (
        <div className={ `flex flex-col gap-1 ${wFull ? 'flex-grow' : 'w-32'}` }>
            <label className="text-xs font-small" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
            <div className={ `flex items-center justify-center ${wFull ? 'flex-grow' : 'w-11'} h-8 text-center text-xs px-3 border rounded-md bg-green-600` }>
                <p className='text-white'>{ propertyValue }</p>
            </div>
        </div>
    );
}

interface VariationFieldInputFilledProps {
    productVariation: VariationProductType;
    images: ImageProductDataType[];
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
}

export default function VariationFieldInputFilled({ productVariation, images, handleUpdateProductVariation }: VariationFieldInputFilledProps) {
    const { customProperties, defaultProperties } = productVariation;
    const [showChooseImageModel, setShowChooseImageModel] = useState<boolean>(false);
    const [ imageIndex, setImageIndex ] = useState(productVariation.defaultProperties.imageIndex);

    const estoqueAndPeso = [
        { propertyName: 'estoque', propertyValue: defaultProperties.estoque },
        { propertyName: 'peso', propertyValue: defaultProperties.peso },
    ];

    const barCodeAndSku = [
        { propertyName: 'código de barras', propertyValue: defaultProperties.barCode },
        { propertyName: 'sku', propertyValue: defaultProperties.sku },
    ];

    function handleImageChange(foundedImage: ImageProductDataType | undefined) {
        setImageIndex(foundedImage ? foundedImage.index : 0);
        handleUpdateProductVariation(productVariation, {
            ...productVariation,
            defaultProperties: {
                ...productVariation.defaultProperties,
                imageIndex: foundedImage ? foundedImage.index : 0,
            },
        });
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex gap-4 justify-evenly w-full'>
                <ChooseImage
                    images={ images }
                    imageIndex={ imageIndex }
                    showChooseImageModel={ showChooseImageModel }
                    handleImageChange={ handleImageChange }
                    setShowChooseImageModel={ setShowChooseImageModel }
                />

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
