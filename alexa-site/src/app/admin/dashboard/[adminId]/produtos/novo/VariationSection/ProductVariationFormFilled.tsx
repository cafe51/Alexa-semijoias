// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationFormFilled.tsx
import { useState } from 'react';
import UpdateProductVariationForm from './UpdateProductVariationForm';
import { FaTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import VariationFieldInputFilled from './VariationFieldInputFilled';
import { VariationProductType } from '@/app/utils/types';


interface ProductVariationFilledProps {
    handleRemoveProductVariation: (productVariation: any) => void;
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
    productVariation: any;
    variations: string[];
    setEditingIndex: () => void
    images: string[] | null;
}

function ProductVariationFilled({ handleRemoveProductVariation, handleUpdateProductVariation, productVariation, setEditingIndex, images }: ProductVariationFilledProps) {
    return (
        <div className='flex flex-col p-2 gap-2 rounded-lg bg-green-100 border border-solid border-green-400 w-full'>
            <div className='flex w-full justify-end'>
                <button className='text-blue-500 ' onClick={ setEditingIndex }>
                    <FiEdit size={ 24 }/>
                </button>
            </div>
            <div className=' flex flex-wrap gap-2'>
                <VariationFieldInputFilled
                    handleUpdateProductVariation={ handleUpdateProductVariation }
                    productVariation={ productVariation }
                    images={ images }
                />
            </div>
            <div className='flex w-full justify-end'>
                <button className='text-red-500' onClick={ () => handleRemoveProductVariation(productVariation) }>
                    <FaTrashAlt size={ 24 }/>
                </button>
            </div>
        </div>

    );
}

interface ProductVariationFormFilledProps {
    sections: string[]
    totalProductVariationsCreated: number;
    handleRemoveProductVariation: (productVariation: VariationProductType) => void;
    handleUpdateProductVariation: (oldVariation: VariationProductType, newVariation: VariationProductType) => void;
    variations: string[];
    productVariations: VariationProductType[];
    images: string[] | null;
}

export default function ProductVariationFormFilled({
    sections,
    totalProductVariationsCreated,
    images,
    variations,
    productVariations,
    handleRemoveProductVariation,
    handleUpdateProductVariation,
}: ProductVariationFormFilledProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <div className='w-full flex self-center gap-2 flex-wrap justify-center'>
                {
                    productVariations.map((productVariation, index) => (
                        editingIndex === index 
                            ?
                            <UpdateProductVariationForm
                                key={ index }
                                handleUpdateProductVariation={ handleUpdateProductVariation }
                                productVariation={ productVariation }
                                variations={ variations }
                                setEditionProductVariationMode={ () => setEditingIndex(null) }
                                totalProductVariationsCreated={ totalProductVariationsCreated }
                                sections={ sections }
                            />
                            :

                            <ProductVariationFilled
                                key={ index }
                                images={ images }
                                handleUpdateProductVariation={ handleUpdateProductVariation }
                                handleRemoveProductVariation={ handleRemoveProductVariation }
                                productVariation={ productVariation }
                                variations={ variations }
                                setEditingIndex={ () => setEditingIndex(index) }
                            />
                            
                    )) }
            </div>
        </div>
    );
}