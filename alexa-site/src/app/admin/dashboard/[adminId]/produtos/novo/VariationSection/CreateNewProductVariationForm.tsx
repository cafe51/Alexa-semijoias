// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateNewProductVariationForm.tsx

import { Dispatch, SetStateAction, useState } from 'react';
import LargeButton from '@/app/components/LargeButton';
import ProductVariationForm from './ProductVariationForm';
import { VariationProductType } from '@/app/utils/types';


interface CreateNewProductVariationFormProps {
  variations: string[];
  setProductVariationState: Dispatch<SetStateAction<VariationProductType>>
  productVariationState: VariationProductType;
  handleAddProductVariation: (productVariation: VariationProductType) => void;
}

export default function CreateNewProductVariationForm({
    variations,
    productVariationState, 
    setProductVariationState,
    handleAddProductVariation,
}: CreateNewProductVariationFormProps) {
    const [quantidade, setQuantidade] = useState(0);
    const [peso, setPeso] = useState(0);
    const [dimensions, setDimensions] = useState({
        altura: 0,
        largura: 0,
        comprimento: 0,
    });

    const [isFormValid, setIsFormValid] = useState(false);

    function handleSaveVariation() {
        console.log(Object.keys(productVariationState));
        console.log(variations);
        try {
            if (!isFormValid) {
                throw new Error('Todos os campos devem estar preenchidos');
            }
            handleAddProductVariation({
                ...productVariationState,
                defaultProperties: {
                    quantidade: quantidade ? quantidade : 0,
                    peso: peso ? peso : 0,
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
                        peso: 0,
                        quantidade: 0,
                        dimensions: {
                            largura: 0,
                            altura: 0,
                            comprimento: 0,
                        },
                    } };
            });
            setQuantidade(0);
            setPeso(0);
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
                setIsFormValid={ setIsFormValid }
                variations={ variations }
                productVariationState={ productVariationState }
                setProductVariationState={ setProductVariationState }
                quantidade={ quantidade }
                setQuantidade={ setQuantidade }
                peso={ peso }
                setPeso={ setPeso }
                dimensions={ dimensions }
                setDimensions={ setDimensions }
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