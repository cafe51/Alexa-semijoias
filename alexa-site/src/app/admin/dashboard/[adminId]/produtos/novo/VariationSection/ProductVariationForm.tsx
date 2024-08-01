// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';
import VariationFieldInput from './VariationFieldInput';

function InputQuantity({ quantidade, setQuantidade }: { quantidade: number; setQuantidade: Dispatch<SetStateAction<number>> }) {
    return (
        <div className='flex flex-col gap-2 w-5/12 justify-self-start'>
            <label className="text-xs font-small" htmlFor="quantidade">Quantidade</label>
            <input
                className="text-xs self-center px-3 py-2 border rounded-md w-5/6"
                id="quantidade"
                name="quantidade"
                type="number"
                value={ quantidade }
                onChange={ (e) => setQuantidade(Number(e.target.value)) }
                placeholder=''
            />
        </div>
    );
}

interface ProductVariationFormProps {
  variations: string[];
  setProductVariationState: Dispatch<SetStateAction<any>>;
  productVariationState: any;
  quantidade: number;
  setQuantidade: Dispatch<SetStateAction<number>>;
  setIsFormValid: Dispatch<SetStateAction<boolean>>;
}

export default function ProductVariationForm({
    variations,
    productVariationState,
    setProductVariationState,
    quantidade,
    setQuantidade,
    setIsFormValid,
}: ProductVariationFormProps) {

    useEffect(() => {
        console.log('dados de productVariationForm', {
            productVariationState,
            quantidade,
            variations,
        });
        const isValid = validateForm();
        setIsFormValid(isValid);
    }, [productVariationState, quantidade, variations]);

    const validateForm = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { quantidade, ...rest } = productVariationState;
        if (JSON.stringify(variations) !== JSON.stringify(Object.keys(rest))) {
            return false;
        }

        if (!rest || Object.keys(rest).length === 0) {
            return false;
        }

        for (const key in rest) {
            if (rest[key] === '') {
                return false;
            }
        }

        return true;
    };

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <div className='w-full flex self-center gap-2 flex-wrap'>
                { variations.map((variation, index) => (
                    <VariationFieldInput
                        key={ index }
                        variation={ variation }
                        productVariationState={ productVariationState }
                        setProductVariationState={ setProductVariationState }
                    />
                )) }
      
                <InputQuantity quantidade={ quantidade } setQuantidade={ setQuantidade } />
            </div>

        </div>
    );
}