import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImSpinner9 } from 'react-icons/im';

interface QuantitySelectionCartBoxProps {
  quantity: number;
  removeOne: () => void;
  addOne: () => void;
  stock: number;
  isLoadingButton: boolean;
}

export default function QuantitySelectionCartBox({
    quantity,
    removeOne,
    addOne,
    stock,
    isLoadingButton,
}: QuantitySelectionCartBoxProps) {
    return (
        <div className="flex items-center border border-[#F8C3D3] rounded-md px-1">
            <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 h-10"
                onClick={ quantity <= 1 ? undefined : removeOne }
                disabled={ quantity <= 1 || isLoadingButton }
            >
                { isLoadingButton ? (
                    <ImSpinner9 className="text-gray-500 animate-spin" />
                ) : (
                    <Minus className="h-4 w-4 md:h-5 md:w-5" />
                ) }
            </Button>

            <span className="mx-2 text-sm md:text-base w-6 text-center">
                { quantity }
            </span>

            <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 h-10"
                onClick={ quantity >= stock ? undefined : addOne }
                disabled={ quantity >= stock || isLoadingButton }
            >
                { isLoadingButton ? (
                    <ImSpinner9 className="text-gray-500 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4 md:h-5 md:w-5" />
                ) }
            </Button>
        </div>
    );
}
