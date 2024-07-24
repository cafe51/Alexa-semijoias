// app/components/SmallButton.tsx
import { ImSpinner9 } from 'react-icons/im';

interface LargeButtonProps {
    disabled?: boolean;
    loadingButton: boolean;
    color: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export default function SmallButton({ disabled, loadingButton, color, children, onClick, type='button' }: LargeButtonProps) {
    const bgColorClass = disabled || loadingButton ? 'bg-gray-300' : `bg-${color}-500`;

    
    return (
        <button
            className={ `${bgColorClass} rounded-full p-4 px-6 font-bold text-white disabled:bg-green-200 text-center flex items-center justify-center` }
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
