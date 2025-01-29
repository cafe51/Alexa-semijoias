// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/ProductVariationForm.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';
import InputStandardProperties from './InputStandardProperties';
import { ProductDefaultPropertiesType, StateNewProductType, VariationProductType } from '@/app/utils/types';
import InputCustomProperties from './InputCustomProperties';

interface ProductVariationFormProps {
    state: StateNewProductType;
    productDefaultProperties: ProductDefaultPropertiesType
    handleProductDefaultPropertyChange: (value: any, field: string) => void
    handleProductCustomPropertyChange: (value: string, field: string) => void;
    productVariationState: VariationProductType;
    setIsFormValid: Dispatch<SetStateAction<boolean>>;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    barCodeErrorMessage: string | undefined;
    skuErrorMessage: string | undefined;
    setBarCodeErrorMessage: Dispatch<SetStateAction<string | undefined>>
    setSkuErrorMessage: Dispatch<SetStateAction<string | undefined>>
}

export default function ProductVariationForm({
    state,
    productVariationState,
    handleProductCustomPropertyChange,
    productDefaultProperties: { barCode, estoque, sku },
    productDefaultProperties,
    handleProductDefaultPropertyChange,
    setIsFormValid,
    setErrorMessage,
    barCodeErrorMessage,
    skuErrorMessage,
    setBarCodeErrorMessage,
    setSkuErrorMessage,
}: ProductVariationFormProps) {

    useEffect(() => {
        const isValid = validateForm();
        setIsFormValid(isValid);
    }, [productVariationState, estoque, sku, barCode]);

    const validateForm = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { customProperties, defaultProperties } = productVariationState;

        if (JSON.stringify(state.variations.sort()) !== JSON.stringify(Object.keys(customProperties).sort())) {
            return false;
        }

        if (!customProperties || Object.keys(customProperties).length === 0) {
            // console.log('AAAAAAASASASASASASASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', customProperties);

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
                <InputCustomProperties
                    state={ state }
                    productVariationState={ productVariationState }
                    handleProductDefaultPropertyChange={ handleProductDefaultPropertyChange }
                    handleProductCustomPropertyChange={ handleProductCustomPropertyChange }
                    setErrorMessage={ setErrorMessage }
                />
      
                <InputStandardProperties
                    state={ state }
                    productDefaultProperties={ productDefaultProperties }
                    handleProductDefaultPropertyChange={ handleProductDefaultPropertyChange }
                    totalProductVariationsCreated={ state.productVariations.length }
                    productVariationState={ productVariationState }
                    barCodeErrorMessage={ barCodeErrorMessage }
                    setBarCodeErrorMessage={ setBarCodeErrorMessage }
                    setSkuErrorMessage={ setSkuErrorMessage }
                    skuErrorMessage={ skuErrorMessage }
                />
            </div>

        </div>
    );
}