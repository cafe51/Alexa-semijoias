// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/InputField.tsx

import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';

interface InputFieldProps {
    index: number,
    propertyName: string,
    propertyValue: number,
    setProperty: (value: number) => void
}

export default function InputField({ index, propertyName, propertyValue, setProperty }: InputFieldProps) {
    return (
        <div key={ index } className='flex flex-col gap-2 w-5/12'>
            <label className="text-xs" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
            <input
                className="text-xs px-3 py-2 border rounded-md "
                id={ propertyName }
                name={ propertyName }
                type="text"
                value={ propertyValue }
                onChange={ (e) => transformTextInputInNumber(e.target.value, setProperty) }
                placeholder=''
            />
        </div>
    );
}