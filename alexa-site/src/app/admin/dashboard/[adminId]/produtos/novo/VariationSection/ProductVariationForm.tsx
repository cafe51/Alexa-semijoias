// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useState } from 'react';
import VariationFieldInput from './VariationFieldInput';
import LargeButton from '@/app/components/LargeButton';

function InputQuantity({ quantity, setQuantity }: { quantity: number; setQuantity: Dispatch<SetStateAction<number>> }) {
    return (
        <div className='flex flex-col gap-2 p-2 w-full'>
            <label className="text-xs font-small" htmlFor="quantidade">Quantidade</label>
            <input
                className="text-xs self-center px-3 py-2 border rounded-md w-5/6"
                id="quantidade"
                name="quantidade"
                type="number"
                value={ quantity }
                onChange={ (e) => setQuantity(Number(e.target.value)) }
                placeholder=''
            />
        </div>
    );
}

interface ProductVariationFormProps {
  variations: string[];
  setProductVariationState: Dispatch<SetStateAction<any>>;
  productVariationState: any;
  handleAddProductVariation: (productVariation: any) => void;
}

export default function ProductVariationForm({ variations, productVariationState, setProductVariationState, handleAddProductVariation }: ProductVariationFormProps) {
    const [quantity, setQuantity] = useState(0);

    const handleSaveVariation = () => {
        console.log(Object.keys(productVariationState));
        console.log(variations);
        try {
            if (!productVariationState || Object.keys(productVariationState).length === 0) {
                throw new Error('Preenchimento inválido');
            }
          
            for (const key in productVariationState) {
                if (productVariationState[key] === '') {
                    throw new Error('Todos os campos devem estar preenchidos');
                }
            }
            handleAddProductVariation({ ...productVariationState, quantity });
            setProductVariationState({});
            setQuantity(0);
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <div className='w-full flex self-center gap-2 flex-wrap justify-center'>
                { variations.map((variation, index) => (
                    <VariationFieldInput
                        key={ index }
                        variation={ variation }
                        productVariationState={ productVariationState }
                        setProductVariationState={ setProductVariationState }
                    />
                )) }
      
                <InputQuantity quantity={ quantity } setQuantity={ setQuantity } />
            </div>

            <LargeButton
                color='blue'
                disabled={ false }
                loadingButton={ false }
                onClick={ handleSaveVariation }>
                  Salvar variação
            </LargeButton>
        </div>
    );
}