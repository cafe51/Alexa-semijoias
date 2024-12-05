import toTitleCase from '@/app/utils/toTitleCase';
import { Label } from '@radix-ui/react-label';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import React from 'react';

interface OptionButtonProps {
  option: string;
  isAvailable: boolean;
  handleOptionSelect: (option: string) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, isAvailable, handleOptionSelect }) => (
    <RadioGroup className="flex flex-wrap gap-2">

        <div className="relative">
            <RadioGroupItem
                value={ option }
                id={ option }
                className="peer sr-only"
                disabled={ !isAvailable }
                onClick={ () => handleOptionSelect(option) } 
            />
            <Label
                htmlFor={ option }
                className={ `flex items-center justify-center px-3 py-2 text-xs md:text-sm font-medium bg-white border rounded-md cursor-pointer
                  ${!isAvailable 
        ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
        : 'border-[#F8C3D3] peer-checked:bg-[#F8C3D3] peer-checked:text-[#333333] hover:bg-[#F8C3D3]/10'
    }` }
            >
                { toTitleCase(option) }
                { !isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[1px] h-full bg-gray-300 transform rotate-45"></div>
                    </div>
                ) }
            </Label>
        </div>

    </RadioGroup>
);

export default OptionButton;