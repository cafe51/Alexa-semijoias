import { Button } from '@/components/ui/button';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { ArrowLeft } from 'lucide-react';

interface CartHeaderProps {
    cartItems: (ProductCartType & FireBaseDocument)[] | ProductCartType[];
}

export default function CartHeader({ cartItems }: CartHeaderProps) {
    const totalItems = cartItems.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0);

    return (
        <section className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
                Carrinho
                <span className="text-lg sm:text-xl font-normal ml-2">({ totalItems + (totalItems > 1 ? ' itens' : ' item') })</span>
            </h1>
            <Button variant="outline" className="text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white hidden sm:flex">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
            </Button>
        </section>
    );
}