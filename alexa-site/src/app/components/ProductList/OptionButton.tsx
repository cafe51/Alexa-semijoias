import React from 'react';

interface OptionButtonProps {
  option: string;
  isAvailable: boolean;
  handleOptionSelect: (option: string) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, isAvailable, handleOptionSelect }) => (
    <div
        className={ `p-2 cursor-pointer transition-colors duration-300 ${
            isAvailable ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
        } ${!isAvailable && 'cursor-not-allowed'}` }
        onClick={ () => handleOptionSelect(option) }
    >
        <p>{ option }</p>
    </div>
);

export default OptionButton;
