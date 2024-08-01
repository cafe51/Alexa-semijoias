// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/UpdateProductVariationForm.tsx

import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import ProductVariationForm from './ProductVariationForm';


interface UpdateProductVariationFormProps {
  variations: string[];
  handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void
  productVariation: any;
  setEditionProductVariationMode: () => void;


}

export default function UpdateProductVariationForm({
    variations,
    productVariation,
    handleUpdateProductVariation,
    setEditionProductVariationMode,
}: UpdateProductVariationFormProps) {
    const [newProductVariationState, setNewProductVariationState] = useState(productVariation);
    const [quantidade, setQuantidade] = useState(productVariation.quantidade);
    const [isFormValid, setIsFormValid] = useState(false);

    function handleUpdateVariation() {
        console.log(Object.keys(productVariation));
        console.log(variations);
        try {
            if (!isFormValid) {
                throw new Error('Todos os campos devem estar preenchidos');
            }
            handleUpdateProductVariation(productVariation, { ...newProductVariationState, quantidade });
            setEditionProductVariationMode();
            setQuantidade(0);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className='flex p-2 gap-2 rounded-lg border border-solid border-blue-400 w-full'>
            <ProductVariationForm
                setIsFormValid={ setIsFormValid }
                variations={ variations }
                productVariationState={ newProductVariationState }
                setProductVariationState={ setNewProductVariationState }
                quantidade={ quantidade }
                setQuantidade={ setQuantidade }
            />
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