// app/carrinho/CartItemsSection.tsx
// import { useEffect } from 'react';
import { ProductCartType } from '../utils/types';
import CartItem from './CartItem';
import { useCollection } from '../hooks/useCollection';
import { useCart } from '../hooks/useCart';

export default function CartItemsSection({ productIds, carrinho }: any) {
    const { mappedProducts } = useCart(productIds, carrinho);

    const { updateDocumentField } = useCollection(
        'carrinhos', null,
    );

    return (
        <section className='flex flex-col gap-1'>
            <h2 className='text-center self-center'>FINALIZE SUA COMPRA</h2>

            <section className='flex flex-col gap-1'>
                {
                    mappedProducts ? mappedProducts.map((produto: ProductCartType) => <CartItem key={ produto.id } produto={ produto } changeQuantity={ updateDocumentField } />) : <span>Loading...</span>
                }
            </section>
            <section className='flex flex-col gap-4 w-full p-6 bg-white shadow-lg rounded-lg shadowColor'>
                <h2>Resumo</h2>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Subtotal</p>
                    <p>R$ { mappedProducts?.map((items: any) => (Number(items.quantidade) * (items.preco))).reduce((a, b) => a + b, 0).toFixed(2) }</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Frete</p>
                    <p>Calcular</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Total</p>
                    <p>R$ { (120).toFixed(2) }</p>
                </div>
                <div className='flex flex-col text-end w-full'>
                    <p>à vista com 10% OFF</p>
                    <p>ou até 6x R$ { (50).toFixed(2) } sem juros</p>
                </div>
                <button className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'>
            Finalizar compra
                </button>
                <button className='rounded-full bg-blue-500 p-4 px-6 font-bold text-white'>
            Continuar comprando
                </button>
            </section>
        </section>
    );
}
