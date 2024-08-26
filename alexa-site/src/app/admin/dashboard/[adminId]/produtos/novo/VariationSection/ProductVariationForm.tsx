// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';
import VariationFieldInput from './VariationFieldInput';
import InputStandartProperties from './InputStandartProperties';
import { VariationProductType } from '@/app/utils/types';

interface ProductVariationFormProps {
  variations: string[];
  setProductVariationState:  Dispatch<SetStateAction<VariationProductType>>;
  productVariationState: VariationProductType;
  estoque: number;
  setEstoque: Dispatch<SetStateAction<number>>;
  peso: number;
  setPeso: Dispatch<SetStateAction<number>>;
  dimensions: {
    altura: number;
    largura: number;
    comprimento: number;
}
  setDimensions: Dispatch<SetStateAction<{
    altura: number;
    largura: number;
    comprimento: number;
}>>
  setIsFormValid: Dispatch<SetStateAction<boolean>>;
}

export default function ProductVariationForm({
    variations,
    productVariationState,
    setProductVariationState,
    estoque,
    dimensions,
    peso,
    setEstoque,
    setDimensions,
    setPeso,
    setIsFormValid,
}: ProductVariationFormProps) {

    useEffect(() => {
        const isValid = validateForm();
        setIsFormValid(isValid);
    }, [productVariationState, estoque, variations]);

    const validateForm = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { customProperties, defaultProperties } = productVariationState;

        if (JSON.stringify(variations) !== JSON.stringify(Object.keys(customProperties))) {
            return false;
        }

        if (!customProperties || Object.keys(customProperties).length === 0) {
            return false;
        }

        for (const key in customProperties) {
            if (customProperties[key] === '') {
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
      
                <InputStandartProperties
                    estoque={ estoque }
                    setEstoque={ setEstoque }
                    peso={ peso }
                    setPeso={ setPeso }
                    dimensions={ dimensions }
                    setDimensions={ setDimensions }
                />
            </div>

        </div>
    );
}