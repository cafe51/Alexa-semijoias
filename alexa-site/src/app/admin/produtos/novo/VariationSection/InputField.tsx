// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/InputField.tsx

import { ChangeEvent } from 'react';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);


interface InputFieldProps {
    propertyName: string,
    propertyValue: string | number,
    propertyKey: string,
    onChange:  (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ propertyName, propertyValue, propertyKey, onChange }: InputFieldProps) {
    return (
        <div className='flex flex-col gap-2 w-5/12'>
            <label className="text-xs" htmlFor={ propertyKey }>{ capitalize(propertyName) }</label>
            <input
                className="text-xs px-3 py-2 border rounded-md "
                id={ propertyKey }
                name={ propertyKey }
                type="text"
                value={ propertyValue }
                onChange={ onChange }
                placeholder=''
                aria-label={ `Insira o ${propertyName}` }
            />
        </div>
    );
}