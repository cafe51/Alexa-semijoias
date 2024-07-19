// app/checkout/AddressSection/InputField.tsx

import { FormEventHandler } from 'react';

interface InputFieldProps {
    id: string;
    name?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined; 
    minLength?: number;
    maxLength?: number;
    label: string;
    readOnly?: boolean;
    type?: string;

    disabled?: boolean;
    onInvalid?: FormEventHandler<HTMLInputElement>
    onInput?: FormEventHandler<HTMLInputElement>;

}

export default function InputField({
    id,
    value,
    onChange,
    maxLength,
    minLength,
    label,
    readOnly = false,
    type='text',
    disabled = false,
    onInvalid,
    onInput,


}: InputFieldProps) {
    return (
        <div className="relative w-full ">
            <input
                type={ type }
                id={ id }
                name={ id }
                value={ value }
                onChange={ onChange }
                maxLength={ maxLength }
                minLength={ minLength }

                readOnly={ readOnly }
                onInvalid={ onInvalid }
                onInput={ onInput }
                disabled={ disabled }
                className="border-2 py-2 pl-9 pr-3 w-full peer rounded-lg shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1"
            />
            <label
                htmlFor={ id }
                className={ `absolute left-2 text-gray-400 transition-all duration-200 ease-in-out ${value ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'} peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
            >
                { label }
            </label>
        </div>
    );
}