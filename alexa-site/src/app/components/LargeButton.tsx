//app/components/LargeButton.tsx

import { ImSpinner9 } from 'react-icons/im';

interface LargeButtonProps {
    disabled?: boolean;
    loadingButton: boolean;
    color: string;
}

export default function LargeButton({ disabled, loadingButton, color }: LargeButtonProps) {
    return(
        <button
            className={ `${disabled || loadingButton ? 'bg-gray-300' : `bg-${color}-500`} p-3 text-white flex justify-center text-center rounded w-full shadow-sm` }
            type="submit"
            disabled={ disabled || loadingButton }
        >
            { loadingButton ? (
                <ImSpinner9 className="text-gray-500 animate-spin" />
            ) : (
                'Continuar'
            ) }
        </button>
    );
}