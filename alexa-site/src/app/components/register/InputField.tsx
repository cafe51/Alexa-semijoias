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

export default function InputField({ label, id, name, type, placeholder, value, onChange, error }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={ id } className="text-sm font-medium text-[#333333]">
                { label }
            </Label>
            <Input
                name={ name }
                id={ id }
                type={ type }
                placeholder={ placeholder }
                value={ value }
                onChange={ onChange }
                className={ `w-full px-3 py-2 border rounded-md text-[#333333] ${error ? 'border-red-500' : ''}` }
            />
            { error && <p className="text-red-500 text-xs mt-1">{ error }</p> }
        </div>
    );
}