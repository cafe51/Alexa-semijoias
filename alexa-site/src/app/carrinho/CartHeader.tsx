import { FireBaseDocument, ProductCartType } from '../utils/types';
import ContinueShoppingButton from './ContinueShoppingButton';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface CartHeaderProps {
    cartItems: (ProductCartType & FireBaseDocument)[] | ProductCartType[];
    router: AppRouterInstance
}

export default function CartHeader({ cartItems, router }: CartHeaderProps) {
    const totalItems = cartItems.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0);

    return (
        <section className="flex justify-between items-center mb-8 text">
            <h1 className="text-2xl sm:text-3xl text-center w-full ">
                CARRINHO
                <span className="text-lg sm:text-xl font-normal ml-2">({ totalItems + (totalItems > 1 ? ' itens' : ' item') })</span>
            </h1>
            <ContinueShoppingButton className="mt-8 hidden sm:flex" router={ router }/>
        </section>
    );
}