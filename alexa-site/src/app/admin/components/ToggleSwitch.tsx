// app/admin/components/ToggleSwitch.tsx
'use client';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <button
            type="button"
            onClick={ () => onChange(!checked) }
            className={ `relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                checked ? 'bg-green-500' : 'bg-gray-300'
            }` }
        >
            <span
                className={ `inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }` }
            />
        </button>
    );
};

export default ToggleSwitch;
