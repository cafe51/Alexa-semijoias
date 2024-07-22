// app/components/LargeButton.tsx
import { ImSpinner9 } from 'react-icons/im';

interface LargeButtonProps {
    disabled?: boolean;
    loadingButton: boolean;
    color: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export default function LargeButton({ disabled, loadingButton, color, children, onClick }: LargeButtonProps) {
    const bgColorClass = disabled || loadingButton ? 'bg-gray-300' : `bg-${color}-500`;

    
    return (
        <button
            className={ `${bgColorClass} p-3 text-white flex justify-center items-center rounded w-full shadow-sm` }
            type="submit"
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
