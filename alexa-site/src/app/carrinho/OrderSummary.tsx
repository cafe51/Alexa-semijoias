import { formatPrice } from '../utils/formatPrice';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import ShippingCalculator from './ShippingCalculator';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSummary({ 
    subtotal, 
    shipping, 
    total, 
    onSelectShipping, 
    onCheckout,
}: { 
    subtotal: number;
    shipping: number | null;
    total: number;
    onSelectShipping: (optionId: string) => void;
    onCheckout: () => void;
}) {
    return (
        <div className="w-full md:max-w-2xl md:mx-auto flex-grow">
            <Card className="w-full shadow-md shadow-[#C48B9F]">
                <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6">Resumo do Pedido</h2>
                    <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                        <div className="flex justify-between">
                            <span className="text-base md:text-lg lg:text-xl">Subtotal:</span>
                            <span className="text-base md:text-lg lg:text-xl">{ formatPrice(subtotal) }</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base md:text-lg lg:text-xl">Frete:</span>
                            <ShippingCalculator onSelectShipping={ onSelectShipping } selectedShipping={ shipping }/>
                        </div>
                    </div>
                    <Separator className="my-4 md:my-6" />
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <span className="text-lg md:text-xl lg:text-2xl font-semibold">Total:</span>
                        <span className="text-lg md:text-xl lg:text-2xl font-semibold">{ formatPrice(total) }</span>
                    </div>
                    <div className='flex flex-col text-end w-full'>
                        <p className="text-sm md:text-base lg:text-lg">Em até 6x <span className='font-bold'>{ formatPrice(total / 6) }</span> sem juros</p>
                    </div>
                    <Button 
                        className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white text-base md:text-lg lg:text-xl py-2 md:py-6 mt-4 md:mt-6"
                        onClick={ onCheckout }
                    >
                        <ShoppingBag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                        Finalizar Compra
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}