// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationFieldInput.tsx

import { Dispatch, SetStateAction } from 'react';

interface VariationFieldInputProps {
    variation: string;
    setProductVariationState: Dispatch<SetStateAction<any>>;
    productVariationState: any;
}

export default function VariationFieldInput({ variation, setProductVariationState, productVariationState }: VariationFieldInputProps) {

    return (
        <div className="flex w-5/12">
            <div className='flex flex-col gap-2 w-full'>
                <label className="text-xs" htmlFor={ variation }>{ variation.charAt(0).toUpperCase() + variation.slice(1) }</label>
                <input
                    className="text-xs self-center px-3 py-2 border rounded-md w-5/6"
                    id={ variation }
                    name={ variation }
                    type="text"
                    value={ productVariationState[variation] || '' }
                    onChange={ (e) => {
                        setProductVariationState((prevState: any) => ({
                            ...prevState,
                            [variation]: e.target.value,
                        }));
                    } }
                    placeholder=''
                />
            </div>
        </div>
    );
}