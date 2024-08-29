// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationFormFilled.tsx
import { useState } from 'react';
import UpdateProductVariationForm from './UpdateProductVariationForm';
import { FaTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import VariationFieldInputFilled from './VariationFieldInputFilled';
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';


interface ProductVariationFilledProps {
    handlers: UseNewProductState;
    productVariation: any;
    setEditingIndex: () => void
    images: string[] | null;
}

function ProductVariationFilled({ handlers, productVariation, setEditingIndex, images }: ProductVariationFilledProps) {
    return (
        <div className='flex flex-col p-2 gap-2 rounded-lg bg-green-100 border border-solid border-green-400 w-full'>
            <div className='flex w-full justify-end'>
                <button className='text-blue-500 ' onClick={ setEditingIndex }>
                    <FiEdit size={ 24 }/>
                </button>
            </div>
            <div className=' flex flex-wrap gap-2'>
                <VariationFieldInputFilled
                    handleUpdateProductVariation={ handlers.handleUpdateProductVariation }
                    productVariation={ productVariation }
                    images={ images }
                />
            </div>
            <div className='flex w-full justify-end'>
                <button className='text-red-500' onClick={ () => handlers.handleRemoveProductVariation(productVariation) }>
                    <FaTrashAlt size={ 24 }/>
                </button>
            </div>
        </div>

    );
}

interface ProductVariationFormFilledProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    images: string[] | null;
}

export default function ProductVariationFormFilled({ handlers, state, images }: ProductVariationFormFilledProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <div className='w-full flex self-center gap-2 flex-wrap justify-center'>
                {
                    state.productVariations.map((productVariation, index) => (
                        editingIndex === index 
                            ?
                            <UpdateProductVariationForm
                                key={ index }
                                state={ state }
                                handlers={ handlers }
                                productVariation={ productVariation }
                                setEditionProductVariationMode={ () => setEditingIndex(null) }
                            />
                            :

                            <ProductVariationFilled
                                key={ index }
                                handlers={ handlers }
                                images={ images }
                                productVariation={ productVariation }
                                setEditingIndex={ () => setEditingIndex(index) }
                            />
                            
                    )) }
            </div>
        </div>
    );
}