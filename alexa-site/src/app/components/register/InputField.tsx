import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
    label: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function InputField({ 
    label, 
    id, 
    name, 
    type, 
    placeholder, 
    value, 
    onChange, 
    error, 
}: InputFieldProps) {
    return (
        <div className="space-y-3 sm:space-y-4 w-full max-w-lg mx-auto">
            <Label 
                htmlFor={ id } 
                className="block text-sm sm:text-base font-medium text-[#333333] transition-all duration-200"
            >
                { label }
            </Label>
            <Input
                name={ name }
                id={ id }
                type={ type }
                placeholder={ placeholder }
                value={ value }
                onChange={ onChange }
                className={ `
                    w-full 
                    px-4 
                    py-2.5 
                    sm:py-3 
                    text-base 
                    border 
                    rounded-lg 
                    text-[#333333] 
                    placeholder:text-gray-400 
                    focus:ring-2 
                    focus:ring-[#D4AF37] 
                    focus:border-transparent 
                    transition-all 
                    duration-200
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
                ` }
            />
            { error && (
                <p className="text-red-500 text-xs sm:text-sm mt-1.5 transition-all duration-200">
                    { error }
                </p>
            ) }
        </div>
    );
}