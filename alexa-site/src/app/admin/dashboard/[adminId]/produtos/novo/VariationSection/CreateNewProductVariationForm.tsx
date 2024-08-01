// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateNewProductVariationForm.tsx

import { Dispatch, SetStateAction, useState } from 'react';
import LargeButton from '@/app/components/LargeButton';
import ProductVariationForm from './ProductVariationForm';


interface CreateNewProductVariationFormProps {
  variations: string[];
  setProductVariationState: Dispatch<SetStateAction<any>>;
  productVariationState: any;
  handleAddProductVariation: (productVariation: any) => void;
}

export default function CreateNewProductVariationForm({
    variations,
    productVariationState, 
    setProductVariationState,
    handleAddProductVariation,
}: CreateNewProductVariationFormProps) {
    const [quantidade, setQuantidade] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);

    function handleSaveVariation() {
        console.log(Object.keys(productVariationState));
        console.log(variations);
        try {
            if (!isFormValid) {
                throw new Error('Todos os campos devem estar preenchidos');
            }
            handleAddProductVariation({ ...productVariationState, quantidade: quantidade ? quantidade : 0 });
            setProductVariationState({});
            setQuantidade(0);
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