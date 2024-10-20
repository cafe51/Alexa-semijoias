// app/components/LargeButton.tsx
import { ImSpinner9 } from 'react-icons/im';

interface LargeButtonProps {
    disabled?: boolean;
    loadingButton?: boolean;
    color: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export default function LargeButton({ disabled, loadingButton=false, color, children, onClick, type='button' }: LargeButtonProps) {
    const bgColorClass = `bg-${color}-500`;

    
    return (
        <button
            className={ `${bgColorClass} p-3 text-white flex justify-center items-center rounded w-full shadow-sm disabled:pointer-events-none disabled:opacity-50` }
            type={ type }
            disabled={ disabled || loadingButton }
            onClick={ onClick }
        >
            { loadingButton
                ? (
                    <ImSpinner9 className="text-gray-500 animate-spin" />
                )
                : (
                    children
                ) }
        </button>
    );
}
