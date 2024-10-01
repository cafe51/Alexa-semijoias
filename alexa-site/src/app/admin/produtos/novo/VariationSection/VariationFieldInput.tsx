// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationFieldInput.tsx

import { VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction } from 'react';

interface VariationFieldInputProps {
    variation: string;
    productVariationState: VariationProductType;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    handleProductDefaultPropertyChange: (value: any, field: string) => void;
    handleProductCustomPropertyChange: (value: string, field: string) => void;
}

export default function VariationFieldInput({
    variation,
    productVariationState,
    setErrorMessage,
    handleProductDefaultPropertyChange,
    handleProductCustomPropertyChange,
}: VariationFieldInputProps) {
    const { customProperties } = productVariationState;
    console.log('variation in customProperties', variation in customProperties);
    console.log('variation', variation);
    console.log('productVariationState', productVariationState);
    return (
        <div className="flex w-5/12">
            <div className='flex flex-col gap-2 w-full'>
                <label className="text-xs" htmlFor={ variation }>{ variation.charAt(0).toUpperCase() + variation.slice(1) }</label>
                <input
                    className="text-xs self-center px-3 py-2 border rounded-md w-5/6"
                    id={ variation }
                    name={ variation }
                    type="text"
                    value={ customProperties[variation as keyof typeof customProperties] || '' }
                    onChange={ (e) => {
                        setErrorMessage(undefined);
                        handleProductDefaultPropertyChange('', 'barCode');
                        handleProductDefaultPropertyChange('', 'sku');
                        handleProductCustomPropertyChange(e.target.value, variation);
                            
                    } }
                    placeholder=''
                />
            </div>
        </div>
    );


}