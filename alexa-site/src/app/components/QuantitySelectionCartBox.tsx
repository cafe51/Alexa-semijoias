import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectionCartBoxProps {
    quantity: number;
    removeOne: () => void;
    addOne: () => void;
    stock: number,

}

export default function QuantitySelectionCartBox({ quantity, removeOne, addOne, stock } : QuantitySelectionCartBoxProps) {
    return (
        <div className="flex items-center border border-[#F8C3D3] rounded-md *:text-lg mx-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:text-gray-700 h-10"
                onClick={ (quantity <= 1) ? (() => null) : removeOne }
                disabled={ quantity <= 1 }
            >
                <Minus className="h-6 w-6" />
            </Button>
            <span className="mx-1 md:mx-2 lg:mx-3 min-w-[1.5rem] md:min-w-[2rem] lg:min-w-[2.5rem] text-center text-sm md:text-base lg:text-lg xl:text-xl">
                { quantity }
            </span>
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:text-gray-700 h-10"
                onClick={ (quantity >= stock) ? (() => null) : addOne }
                disabled={ quantity >= stock }
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    );
}