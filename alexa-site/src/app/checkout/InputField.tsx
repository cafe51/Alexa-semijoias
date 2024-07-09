export default function InputField({ id, value, onChange, maxLength, label, readOnly = false }: any) {
    return (
        <div className="relative mb-4 w-full">
            <input
                type="text"
                id={ id }
                name={ id }
                value={ value }
                onChange={ onChange }
                maxLength={ maxLength }
                readOnly={ readOnly }
                className="border-4 p-2 w-full peer"
            />
            <label
                htmlFor={ id }
                className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${value ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'} peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
            >
                { label }
            </label>
        </div>
    );
}