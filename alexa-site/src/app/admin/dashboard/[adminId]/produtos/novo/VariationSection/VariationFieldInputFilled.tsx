import { VariationProductType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../../../../../public/blankImage.jpg';
import { useState } from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';

interface VariationFieldInputFilledProps {
    productVariation: VariationProductType;
    images: string[] | null;
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;

}

export default function VariationFieldInputFilled({ productVariation, images, handleUpdateProductVariation }: VariationFieldInputFilledProps) {
    const { customProperties, defaultProperties } = productVariation;
    // const [imageIndex, setImageIndex] = useState(0);
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);


    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-evenly w-full'>
                { showVariationEditionModal && <ModalMaker title='Escolha uma imagem' closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                    <div className='flex flex-wrap gap-4'>
                        {
                            images && images.map((image, i) => {
                                return (
                                    <div
                                        key={ i }
                                        className='w-[100px] rounded-lg relative h-[100px] overflow-hidden'
                                        onClick={ () => {
                                            // console.log(images.indexOf(image));
                                            // setImageIndex(images.indexOf(image));
                                            setShowVariationEditionModal(!showVariationEditionModal);
                                            handleUpdateProductVariation(productVariation, {
                                                ...productVariation,
                                                defaultProperties: {
                                                    ...productVariation.defaultProperties,
                                                    imageIndex: images.indexOf(image),
                                                },
                                            });
                                        } }
                                    >
                                        <Image
                                            className='rounded-lg object-cover '
                                            src={ image }
                                            alt={ `Foto da peça ${i}` }
                                            fill
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>

                </ModalMaker> }
                <div
                    className='w-36 rounded-lg relative h-36 overflow-hidden'
                    onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                >
                    <Image
                        className='rounded-lg object-cover '
                        src={ images ? images[productVariation.defaultProperties.imageIndex ? productVariation.defaultProperties.imageIndex : 0] : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='flex flex-col gap-2 w-fit '>
                    {
                        Object.keys(customProperties)
                            .map((property, index) => {
                                if(property in customProperties) {
                                    return (
                                        <div className="flex w-20" key={ index }>
                                            <div className='flex flex-col gap-2 w-full'>
                                                <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                                <input
                                                    className="text-xs self-center px-3 py-2 border rounded-md w-5/6 bg-green-600 text-white"
                                                    id={ property }
                                                    name={ property }
                                                    type={ typeof customProperties[property] === 'number' ? 'number' : 'text' }
                                                    value={ customProperties[property as keyof typeof customProperties] }
                                                    placeholder=''
                                                    readOnly={ true }
    
                                                />
                                            </div>
                                        </div>);
                                }
                            })
                    }
                </div>
            </div>
            

            <section className='flex flex-col gap-4 p-2 w-full rounded-lg'>
                <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-green-400 '>
                    <label className="text-xs font-small" htmlFor="estoque">Estoque</label>
                    <input
                        className="text-xs justify-self-start px-3 py-2 border rounded-md w-2/12 bg-green-600 text-white"
                        id="estoque"
                        name="estoque"
                        type="number"
                        value={ defaultProperties.estoque }
                        placeholder=''
                        readOnly={ true }

                    />
                </div>
                <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-green-400 '>

                    { Object.keys(defaultProperties.dimensions)
                        .map((property, index) => {
                            if(property in defaultProperties.dimensions) {
                                return (
                                    <div key={ index } className='flex flex-col gap-2 w-20 '>
                                        <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                        <div className='flex flex-col gap-2 w-11 '>
                                            <input
                                                className="text-xs px-3 py-2 border rounded-md bg-green-600 text-white"
                                                id={ property }
                                                name={ property }
                                                type="number"
                                                value={ defaultProperties.dimensions[property as keyof typeof defaultProperties.dimensions] }
                                                placeholder=''
                                                readOnly={ true }

                                            />
                                        </div>
                                    </div>
                                );
                            }
                        }) }
                    <div className='flex flex-col gap-2 w-20   '>
                        <label className="text-xs font-small" htmlFor="peso">Peso</label>
                        <div className='flex flex-col gap-2 w-11 '>

                            <input
                                className="text-xs px-3 py-2 border rounded-md bg-green-600 text-white"
                                id="peso"
                                name="peso"
                                type="peso"
                                value={ defaultProperties.peso }
                                placeholder=''
                                readOnly={ true }

                            />
                        </div>

                    </div>
                </div>

            </section>
        </div>

    );
}
