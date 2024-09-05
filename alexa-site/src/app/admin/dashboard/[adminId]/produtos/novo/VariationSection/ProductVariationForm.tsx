// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';
import VariationFieldInput from './VariationFieldInput';
import InputStandardProperties from './InputStandardProperties';
import { ProductDefaultPropertiesType, StateNewProductType, VariationProductType } from '@/app/utils/types';

interface ProductVariationFormProps {
    state: StateNewProductType;
    productDefaultProperties: ProductDefaultPropertiesType
    handleProductDefaultPropertyChange: (field: string, value: any) => void
    setProductVariationState:  Dispatch<SetStateAction<VariationProductType>>;
    productVariationState: VariationProductType;
    setIsFormValid: Dispatch<SetStateAction<boolean>>;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
}

export default function ProductVariationForm({
    state,
    productVariationState,
    setProductVariationState,
    productDefaultProperties: { barCode, estoque ,sku },
    productDefaultProperties,
    handleProductDefaultPropertyChange,
    setIsFormValid,
    setErrorMessage,
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

        if(!barCode || !sku || barCode.length < 1 || sku.length < 1) {
            return false;
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
                        setErrorMessage={ setErrorMessage }

                    />
                )) }
      
                <InputStandardProperties
                    sections={ state.sections }
                    productDefaultProperties={ productDefaultProperties }
                    handleProductDefaultPropertyChange={ handleProductDefaultPropertyChange }
                    totalProductVariationsCreated={ state.productVariations.length }
                    productVariationState={ productVariationState }
                />
            </div>

        </div>
    );
}