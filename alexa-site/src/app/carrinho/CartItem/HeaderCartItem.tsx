import toTitleCase from '@/app/utils/toTitleCase';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { HeaderCartItemProps } from './cartCardInterfaces';

export default function HeaderCartItem({ cartItem, removeAll }: HeaderCartItemProps) {
    return (
        <div className="grid grid-cols-[1fr,auto] items-start">
            <h3 className="font-semibold">
                { toTitleCase(cartItem.name) }
            </h3>
            <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-100 hover:text-red-700"
                onClick={ removeAll }
            >
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
}