// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/UpdateProductVariationForm.tsx

import { Dispatch, SetStateAction, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import ProductVariationForm from './ProductVariationForm';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import deepEqual from '@/app/utils/deepEqual';


interface UpdateProductVariationFormProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    productVariation: VariationProductType;
    setEditionProductVariationMode: () => void;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>
    errorMessage: string | undefined
}

export default function UpdateProductVariationForm({
    handlers,
    state,
    productVariation,
    setEditionProductVariationMode,
    setErrorMessage,
    errorMessage,
}: UpdateProductVariationFormProps) {
    const [newProductVariationState, setNewProductVariationState] = useState<VariationProductType>(productVariation);
    const [estoque, setEstoque] = useState(productVariation.defaultProperties.estoque);
    const [peso, setPeso] = useState(productVariation.defaultProperties.peso);
    const [sku, setSku] = useState(productVariation.defaultProperties.sku);
    const [barCode, setBarCode] = useState(productVariation.defaultProperties.barcode);
    const [dimensions, setDimensions] = useState(productVariation.defaultProperties.dimensions);
    const [isFormValid, setIsFormValid] = useState(false);

    function handleUpdateVariation() {
        console.log(Object.keys(productVariation));
        console.log(state.variations);
        try {
            if (!isFormValid) {
                throw new Error('Todos os campos devem estar preenchidos');
            }

            const pvClone = [...state.productVariations];
            const pvStateCproperties = newProductVariationState.customProperties; // { tamanho: 'grande', cor: 'amarelo' }
            const stateCustomProperties = pvClone.map((pv) => pv.customProperties); // [ { tamanho: 'medio', cor: 'amarelo' }, { tamanho: 'pequeno', cor: 'amarelo' }, ...]
            const existSameCustomProperty = stateCustomProperties.some((stateCustomProperty) => deepEqual(pvStateCproperties, stateCustomProperty));

            if(existSameCustomProperty) { // verifica se já existe a cp dentro da lista de cp criadas
                setErrorMessage('Já existe um produto salvo com essas propriedades');
                return;
            }
            handlers.handleUpdateProductVariation(productVariation, {
                ...newProductVariationState,
                defaultProperties: {
                    ...newProductVariationState.defaultProperties,
                    dimensions,
                    peso,
                    estoque,
                    barcode: barCode,
                    sku,
                },
            });
            setEditionProductVariationMode();
            setEstoque(0);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className='flex p-2 gap-2 rounded-lg border border-solid border-blue-400 w-full'>
            <div className='flex flex-col gap-4'>
                <ProductVariationForm
                    setErrorMessage={ setErrorMessage }
                    state={ state }
                    setIsFormValid={ setIsFormValid }
                    productVariationState={ newProductVariationState }
                    setProductVariationState={ setNewProductVariationState }
                    estoque={ estoque }
                    dimensions={ dimensions }
                    peso={ peso }
                    setDimensions={ setDimensions }
                    setPeso={ setPeso }
                    setEstoque={ setEstoque }
                    barCode={ barCode }
                    setBarCode={ setBarCode }
                    sku={ sku }
                    setSku={ setSku }
                />
                { errorMessage && <p className='text-xs text-center justify-self-center text-red-500'>{ errorMessage }</p> }
            </div>
            <div className='flex flex-col justify-between pr-2 py-2'>

                <button
                    className='text-blue-500'
                    onClick={ () => setEditionProductVariationMode() }>
                    <MdCancel size={ 24 }/>
                </button>

                <button
                    className='text-green-500'
                    disabled={ !isFormValid }
                    onClick={ handleUpdateVariation }
                >
                    <FaCheckCircle size={ 24 } />
                </button>
            </div>
        </div>
    );
}