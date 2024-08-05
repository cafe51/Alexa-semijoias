// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationFormFilled.tsx
import { useState } from 'react';
import UpdateProductVariationForm from './UpdateProductVariationForm';
import { FaTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

interface VariationFieldInputFilledProps {
    productVariation: any;
}

function VariationFieldInputFilled({ productVariation }: VariationFieldInputFilledProps) {

    // const productVariationClone = { ...productVariation };

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex gap-2 w-full'>

                {
                    Object.keys(productVariation)
                        .filter(e => e !== 'quantidade')
                        .filter(e => e !== 'peso')
                        .filter(e => e !== 'altura')
                        .filter(e => e !== 'comprimento')
                        .filter(e => e !== 'largura')

                        .map((property, index) => {
                            if(property in productVariation) {
                                return (
                                    <div className="flex w-5/12" key={ index }>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                            <input
                                                className="text-xs self-center px-3 py-2 border rounded-md w-5/6 bg-green-600 text-white"
                                                id={ property }
                                                name={ property }
                                                type={ typeof productVariation[property] }
                                                value={ productVariation[property as keyof typeof productVariation] }
                                                placeholder=''
                                                readOnly={ true }
    
                                            />
                                        </div>
                                    </div>);
                            }
                        })
                }
            </div>

            <div className=''>
                <label className="text-xs" htmlFor={ 'quantidade' }>{ 'quantidade'.charAt(0).toUpperCase() + 'quantidade'.slice(1) }</label>
                <input
                    className="text-xs self-center px-3 py-2 border rounded-md w-5/6 bg-green-600 text-white"
                    id={ 'quantidade' }
                    name={ 'quantidade' }
                    type={ typeof productVariation['quantidade'] }
                    value={ productVariation['quantidade'] }
                    placeholder=''
                    readOnly={ true }
    
                />
            </div>
        </div>

    );
}

interface ProductVariationFilledProps {
    handleRemoveProductVariation: (productVariation: any) => void;
    productVariation: any;
    variations: string[];
    setEditingIndex: () => void
}

function ProductVariationFilled({ handleRemoveProductVariation, productVariation, setEditingIndex }: ProductVariationFilledProps) {
    return (
        <div className='flex p-2 gap-2 rounded-lg bg-green-100 border border-solid border-green-400'>
            <div className=' flex flex-wrap gap-2'>
                <VariationFieldInputFilled
                    productVariation={ productVariation }
                />
            </div>
            <div className='flex flex-col justify-between pr-2 py-2'>
                <button className='text-blue-500' onClick={ setEditingIndex }>
                    <FiEdit size={ 24 }/>
                </button>
                <button className='text-red-500' onClick={ () => handleRemoveProductVariation(productVariation) }>
                    <FaTrashAlt size={ 24 }/>
                </button>
            </div>
        </div>

    );
}

interface ProductVariationFormFilledProps {
    handleRemoveProductVariation: (productVariation: any) => void;
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
    variations: string[];
    productVariations: any[];
}

export default function ProductVariationFormFilled({
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
                            />
                            :

                            <ProductVariationFilled
                                key={ index }
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