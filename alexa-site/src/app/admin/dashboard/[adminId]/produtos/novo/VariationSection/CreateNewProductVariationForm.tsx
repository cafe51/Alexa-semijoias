// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateNewProductVariationForm.tsx

import { Dispatch, SetStateAction, useState } from 'react';
import LargeButton from '@/app/components/LargeButton';
import ProductVariationForm from './ProductVariationForm';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';


interface CreateNewProductVariationFormProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    setProductVariationState: Dispatch<SetStateAction<VariationProductType>>
    productVariationState: VariationProductType;
}

export default function CreateNewProductVariationForm({ state, handlers, productVariationState, setProductVariationState }: CreateNewProductVariationFormProps) {
    const [estoque, setEstoque] = useState(0);
    const [peso, setPeso] = useState(0);
    const [dimensions, setDimensions] = useState({
        altura: 0,
        largura: 0,
        comprimento: 0,
    });
    const [sku, setSku] = useState('');
    const [barCode, setBarCode] = useState('');


    const [isFormValid, setIsFormValid] = useState(false);

    function handleSaveVariation() {
        try {
            if (!isFormValid) {
                throw new Error('Todos os campos devem estar preenchidos');
            }
            handlers.handleAddProductVariation({
                ...productVariationState,
                defaultProperties: {
                    imageIndex: 0,
                    estoque: estoque ? estoque : 0,
                    peso: peso ? peso : 0,
                    sku: sku ? sku : '',
                    barcode: barCode ? barCode : '',
                    dimensions: dimensions ? dimensions : {
                        altura: 0,
                        largura: 0,
                        comprimento: 0,
                    },

                },
            });
            setProductVariationState((prevState) => {
                const newCustomProperties = { ...prevState.customProperties };
                for (const property in prevState.customProperties) {
                    newCustomProperties[property] = '';
                }
                return {
                    customProperties: newCustomProperties,
                    defaultProperties: {
                        imageIndex: 0,
                        peso: 0,
                        estoque: 0,
                        sku: '',
                        barcode: '',
                        dimensions: {
                            largura: 0,
                            altura: 0,
                            comprimento: 0,
                        },
                    } };
            });
            handlers.handleStockQuantityChange(undefined);
            setEstoque(0);
            setPeso(0);
            setSku('');
            setBarCode('');
            setDimensions({
                altura: 0,
                largura: 0,
                comprimento: 0,
            });

        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <ProductVariationForm
                state={ state }
                setIsFormValid={ setIsFormValid }
                productVariationState={ productVariationState }
                setProductVariationState={ setProductVariationState }
                estoque={ estoque }
                setEstoque={ setEstoque }
                peso={ peso }
                setPeso={ setPeso }
                dimensions={ dimensions }
                setDimensions={ setDimensions }
                barCode={ barCode }
                setBarCode={ setBarCode }
                sku={ sku }
                setSku={ setSku }
            />

            <LargeButton
                color='blue'
                disabled={ !isFormValid }
                loadingButton={ false }
                onClick={ handleSaveVariation }>
                  Salvar variação
            </LargeButton>
        </div>
    );
}