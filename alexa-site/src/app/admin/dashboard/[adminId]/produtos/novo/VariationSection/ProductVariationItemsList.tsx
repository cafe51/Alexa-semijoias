import DisplayCustomProperties from '@/app/components/DisplayCustomProperties';
import { findImage } from '@/app/utils/findImage';
import { ImageProductDataType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import Image from 'next/image';
import { SetStateAction } from 'react';
import RemoveProductVariationButton from './RemoveProductVariationButton';

interface ProductVariationItemsListProps {
    productVariations: never[] | VariationProductType[];
    images: ImageProductDataType[];
    setSelectedProductVariation: (value: SetStateAction<VariationProductType>) => void;
    toggleProductVariationEditionModal: () => void;
    handlers: UseNewProductState;
}

export default function ProductVariationItemsList({
    productVariations,
    setSelectedProductVariation,
    toggleProductVariationEditionModal,
    images,
    handlers,
}: ProductVariationItemsListProps) {
    return (
        <div className='flex flex-wrap gap-1'>
            { 
                productVariations.map((pv) => {
                    const { customProperties, defaultProperties: { estoque, imageIndex, sku } } = pv;
                    return (
                        <div key={ sku } className='flex flex-col w-36 min-h-32 gap-2 p-2 bg-gray-300 rounded'>

                            <div className='flex w-full justify-between'>
                                <div
                                    className='rounded-lg relative h-24 w-24 overflow-hidden flex-shrink-0'
                                    onClick={ () => {
                                        setSelectedProductVariation(pv);
                                        toggleProductVariationEditionModal();
                                    } }
                                >
                                    <Image
                                        className='rounded-lg object-cover '
                                        src={ findImage(images, imageIndex) }
                                        alt="Foto da peça"
                                        fill
                                    />
                                </div>
                                <RemoveProductVariationButton onClick={ () => handlers.handleRemoveProductVariation(pv) }/>
                            </div>

                            <div className='flex flex-col text-xs overflow-hidden'>
                                <p className='font-normal'>estoque: <span className='font-bold'>{ estoque }</span></p>
                                <DisplayCustomProperties customProperties={ customProperties } />
                            </div>
                                    
                        </div>
                    );
                })
            }
        </div>
    );
}