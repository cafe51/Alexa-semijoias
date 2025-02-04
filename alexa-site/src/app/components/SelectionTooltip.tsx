import React, { useEffect } from 'react';

interface SelectionTooltipProps {
    isVisible: boolean;
    onClose: () => void;
}

const SelectionTooltip: React.FC<SelectionTooltipProps> = ({ isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;
   
    return (
        <div className="absolute transform animate-fadeIn z-50">
            <div className="relative bg-[#C48B9F] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#D4AF37] transition-colors duration-300">
                <p className=" whitespace-nowrap text-white">Selecione uma opção</p>
                { /* Seta apontando para baixo */ }
                <div className="absolute -bottom-2 transform -translate-x-1/2 
                    w-0 h-0 
                    border-l-[8px] border-l-transparent 
                    border-t-[8px] border-t-[#C48B9F]
                    border-r-[8px] border-r-transparent">
                </div>
            </div>
        </div>
    );
};

export default SelectionTooltip;
