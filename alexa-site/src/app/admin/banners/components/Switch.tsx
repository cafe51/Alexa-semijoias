import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
    return (
        <div className="flex items-center">
            { label && (
                <span className="mr-2 text-sm text-gray-700">{ label }</span>
            ) }
            <button
                type="button"
                className={ `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    checked ? 'bg-blue-600' : 'bg-gray-200'
                }` }
                role="switch"
                aria-checked={ checked }
                onClick={ onChange }
            >
                <span
                    className={ `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }` }
                />
            </button>
        </div>
    );
};
