// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationFormFilled.tsx
import { Dispatch, SetStateAction, useState } from 'react';
import UpdateProductVariationForm from './UpdateProductVariationForm';
import { FiEdit } from 'react-icons/fi';
import VariationFieldInputFilled from './VariationFieldInputFilled';
import { ImageProductDataType, StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import RemoveProductVariationButton from './RemoveProductVariationButton';


interface ProductVariationFilledProps {
    handlers: UseNewProductState;
    productVariation: VariationProductType;
    setEditingIndex: () => void;
    images: ImageProductDataType[];
    toggleProductVariationEditionModal?: () => void | undefined
}

function ProductVariationFilled({
    handlers,
    productVariation,
    setEditingIndex,
    images,
    toggleProductVariationEditionModal,
}: ProductVariationFilledProps) {
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
            <RemoveProductVariationButton
                onClick={ () => {
                    handlers.handleRemoveProductVariation(productVariation);
                    toggleProductVariationEditionModal && toggleProductVariationEditionModal();
                } }
            />
        </div>

    );
}

interface ProductVariationFormFilledProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    images: ImageProductDataType[];
    productVariation: VariationProductType;
    toggleProductVariationEditionModal?: () => void | undefined
    setSelectedProductVariation: Dispatch<SetStateAction<VariationProductType>>
}

export default function ProductVariationFormFilled({
    handlers,
    state,
    images,
    productVariation,
    toggleProductVariationEditionModal,
    setSelectedProductVariation,
}: ProductVariationFormFilledProps) {
    // const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [barCodeErrorMessage, setBarCodeErrorMessage] = useState<string>();
    const [skuErrorMessage, setSkuErrorMessage] = useState<string>();

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <div className='w-full flex self-center gap-2 flex-wrap justify-center'>
                {
                    editMode 
                        ?
                        <UpdateProductVariationForm
                            errorMessage={ errorMessage }
                            setErrorMessage={ setErrorMessage }
                            state={ state }
                            handlers={ handlers }
                            productVariation={ productVariation }
                            setEditionProductVariationMode={ () => setEditMode(!editMode) }
                            setSelectedProductVariation={ setSelectedProductVariation }
                            barCodeErrorMessage={ barCodeErrorMessage }
                            setBarCodeErrorMessage={ setBarCodeErrorMessage }
                            setSkuErrorMessage={ setSkuErrorMessage }
                            skuErrorMessage={ skuErrorMessage }
                        />
                        :

                        <ProductVariationFilled
                            handlers={ handlers }
                            images={ images }
                            productVariation={ productVariation }
                            setEditingIndex={ () => {
                                setSkuErrorMessage(undefined);
                                setBarCodeErrorMessage(undefined);
                                setErrorMessage(undefined);
                                setEditMode(!editMode);
                            } }
                            toggleProductVariationEditionModal={ toggleProductVariationEditionModal }

                        />
                }
                            
            </div>
        </div>
    );
}