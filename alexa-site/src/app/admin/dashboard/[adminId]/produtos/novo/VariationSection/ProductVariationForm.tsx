// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';
import VariationFieldInput from './VariationFieldInput';
import InputStandartProperties from './InputStandartProperties';
import { StateNewProductType, VariationProductType } from '@/app/utils/types';

interface ProductVariationFormProps {
    state: StateNewProductType;
    setProductVariationState:  Dispatch<SetStateAction<VariationProductType>>;
    productVariationState: VariationProductType;
    estoque: number;
    setEstoque: Dispatch<SetStateAction<number>>;
    peso: number;
    setPeso: Dispatch<SetStateAction<number>>;
    sku: string;
    setSku: Dispatch<SetStateAction<string>>;
    barCode: string;
    setBarCode: Dispatch<SetStateAction<string>>;
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
    state,
    productVariationState,
    setProductVariationState,
    estoque,
    dimensions,
    peso,
    setEstoque,
    sku,
    setSku,
    barCode,
    setBarCode,
    setDimensions,
    setPeso,
    setIsFormValid,
}: ProductVariationFormProps) {

    useEffect(() => {
        const isValid = validateForm();
        setIsFormValid(isValid);
    }, [productVariationState, estoque, sku, barCode]);

    const validateForm = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { customProperties, defaultProperties } = productVariationState;

        if (JSON.stringify(state.variations) !== JSON.stringify(Object.keys(customProperties))) {
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
                { state.variations.map((variation, index) => (
                    <VariationFieldInput
                        key={ index }
                        variation={ variation }
                        productVariationState={ productVariationState }
                        setProductVariationState={ setProductVariationState }
                    />
                )) }
      
                <InputStandartProperties
                    sections={ state.sections }
                    totalProductVariationsCreated={ state.productVariations.length }
                    productVariationState={ productVariationState }
                    estoque={ estoque }
                    setEstoque={ setEstoque }
                    peso={ peso }
                    setPeso={ setPeso }
                    barCode={ barCode }
                    setBarCode={ setBarCode }
                    sku={ sku }
                    setSku={ setSku }
                    dimensions={ dimensions }
                    setDimensions={ setDimensions }
                />
            </div>

        </div>
    );
}