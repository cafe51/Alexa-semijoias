// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationFieldInput.tsx

import { VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction } from 'react';

interface VariationFieldInputProps {
    variation: string;
    setProductVariationState: Dispatch<SetStateAction<VariationProductType>>;
    productVariationState: VariationProductType;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    handleProductDefaultPropertyChange: (value: any, field: string) => void;
}

export default function VariationFieldInput({
    variation,
    setProductVariationState,
    productVariationState,
    setErrorMessage,
    handleProductDefaultPropertyChange,
}: VariationFieldInputProps) {
    const { customProperties } = productVariationState;
    if(variation in customProperties) {
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
                            setProductVariationState((prevState) => ({
                                ...prevState,
                                customProperties: {
                                    ...prevState.customProperties,
                                    [variation]: e.target.value,
                                },
                            }));
                        } }
                        placeholder=''
                    />
                </div>
            </div>
        );
    }

}