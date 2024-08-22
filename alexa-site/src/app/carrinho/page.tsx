// app/carrinho/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import formatPrice from '../utils/formatPrice';
import CartItem from './CartItem';

export default function Carrinho() {
    const { carrinho } = useUserInfo();
    const router = useRouter();

    console.log('CARRINHO', carrinho);

    if (!carrinho || carrinho.length < 0) return <p>Loading...</p>;

    return (
        <section className='flex flex-col gap-1'>
            <h2 className='text-center self-center'>FINALIZE SUA COMPRA</h2>

            <section className='flex flex-col gap-1'>
                {
                    carrinho ? carrinho.map((produto) => {
                        if(produto && produto.quantidade && produto.quantidade > 0) {
                            return <CartItem key={ produto.skuId } produto={ produto } />;
                        } else return false;
                    }) : <span>Loading...</span>
                }
            </section>
            <section className='flex flex-col gap-4 w-full p-6 bg-white shadow-lg rounded-lg shadowColor'>
                <h2>Resumo</h2>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Subtotal</p>
                    <p>{ formatPrice(carrinho?.map((item) => (Number(item.quantidade) * ((item.value.promotionalPrice ? item.value.promotionalPrice : item.value.price)))).reduce((a, b) => a + b, 0)) }</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Frete</p>
                    <p>Calcular</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Total</p>
                    <p>{ formatPrice(120) }</p>
                </div>
                <div className='flex flex-col text-end w-full'>
                    <p>à vista com 10% OFF</p>
                    <p>ou até 6x { formatPrice(50) } sem juros</p>
                </div>
                <button
                    className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'
                    onClick={ () => router.push('/checkout') }
                >
            Finalizar compra
                </button>
                <button
                    className='rounded-full bg-blue-500 p-4 px-6 font-bold text-white'
                >
            Continuar comprando
                </button>
            </section>
        </section>
    );
}
