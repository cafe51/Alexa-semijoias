'use client';

import Link from 'next/link';
import BodyWithHeaderAndFooter from '../components/BodyWithHeaderAndFooter';
import { useUser } from '@/context/UserContext';
import CardOrder from './CardOrder';
import { OrderType } from '../utils/types';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';




export default function ClientProfile() {
    const { user } = useUser();
    const router = useRouter();
    const [orderList, setOrderList] = useState<OrderType[] | []>([]);

    const [temPedidoState, setTemPedidoState] = useState(false);

    useEffect(() => {
        if (!user || !localStorage.getItem('user')) {
            try {
                router.push('/login');
            } catch (e) {
                console.error('Invalid JSON in localStorage:', e);
            }
        }
    }, [router]);

    useEffect(() => {
        if (user && user.pedidos && user.pedidos.length && user.pedidos.length > 0) {
            setTemPedidoState(true);
            setOrderList(user.pedidos);
        } else {
            setTemPedidoState(false);
        }
    }, [user]);


    const realizeSuaCompra = (
        <div className='flex flex-col items-center gap-2 w-full'>
            <FiShoppingCart className='textColored' size={ 24 }/>
            <h3>Realize sua primeira compra</h3>
        </div>
    );

    const listaDeCompras = (
        orderList.reverse().map((pedido: OrderType, index: number) => {
            return (<CardOrder pedido={ pedido } key={ index } />);
        })
    );

    return (
        <BodyWithHeaderAndFooter>
            <div className='flex gap-2'>
                <Link href={ '/' } className='font-normal'>Início</Link>
                <span className='font-normal'>{ '>' }</span>
                <span  className='font-semibold'>Minha conta</span>
            </div>
            <h1>Minha conta</h1>
            <div className='flex flex-col w-full gap-4'>

                <section className='flex flex-col  w-full'>
                    <div className='flex justify-between items-center'>
                        <h2>Dados</h2>
                        <span className='textColored'>Editar</span>
                    </div>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex p-4 w-full shadow-lg rounded-lg shadowColor'>
                        <div className='flex flex-col gap-1'>
                            <h3>{ user?.nome }</h3>
                            <h3>{ user?.email }</h3>
                            <h3>{ user?.tel }</h3>
                        </div>
                    </div>
                </section>

                <section className='flex flex-col w-full'>
                    <h2>Minhas Compras</h2>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex flex-col gap-4 justify-between w-full '>

                            { temPedidoState ? listaDeCompras : realizeSuaCompra }
                            
                            

                        </div>
                        <button className='primColor rounded-full p-2 '>Ir para a loja</button>
                    </div>

                </section>
            </div>
            
        </BodyWithHeaderAndFooter>
    );
}