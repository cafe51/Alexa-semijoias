// app/minha-conta/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Link from 'next/link';
import CardOrder from './CardOrder';
import { LuRefreshCw } from 'react-icons/lu';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import { useDeleteUser } from '../hooks/useDeleteUser';
import DeleteMySelfForm from './DeleteMySelfForm';
import { useManageOrders } from '../hooks/useManageOrders';
import LargeButton from '../components/LargeButton';

export default function MyProfile() {
    const{ user } = useAuthContext();
    const [deleteUseForm, setDeleteUseForm] = useState(false);
    const  { userInfo } = useUserInfo();
    const router = useRouter();
    const { loadingPedidos, pedidos, refreshOrders } = useManageOrders();

    const { error: deleteUserError } = useDeleteUser();

    useEffect(() => {
        if (!userInfo) {
            console.log('MINHA CONTA NÂO TEM USUÁRIO', userInfo);
            router.push('/login');
        }
        // if (pedidos) { setPedidosState(pedidos); }
        console.log('MINHA CONTA USERINFO', userInfo);
        // if (user) { setUsuarioState(user); }

    }, []);

    const handleDeleteMyselfClick = () => {
        if (!user) {
            console.warn('User not logged in.');
        }
        setDeleteUseForm(true);
    };

    const realizeSuaCompra = (
        <div className='flex flex-col items-center gap-2 w-full'>
            <FiShoppingCart className='textColored' size={ 24 }/>
            <h3>Realize sua primeira compra</h3>
        </div>
    );

    const listaDeCompras = (
        pedidos?.map((pedido) => {
            return (<CardOrder pedido={ pedido } key={ pedido.id } />);
        })
    );

    return (
        <main className='h-full'>
            <div className='flex gap-2 h-full'>
                <Link href={ '/' } className='font-normal'>Início</Link>
                <span className='font-normal'>{ '>' }</span>
                <span  className='font-semibold'>Minha conta</span>
            </div>
            <h1>Minha conta</h1>
            <div className='flex flex-col w-full gap-4'>

                <section className='flex flex-col w-full'>
                    <div className='flex items-center'>
                        <h2>Dados</h2>
                    </div>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex justify-between  p-4 w-full shadow-lg rounded-lg shadowColor bg-white '>
                        <div className='flex flex-col gap-1'>
                            <h3>{ userInfo?.nome }</h3>
                            <h3>{ userInfo?.email }</h3>
                            <h3>{ userInfo?.tel }</h3>
                        </div>
                        <span className='textColored'>Editar</span>
                    </div>
                </section>

                <section className='flex flex-col gap-2 w-full'>
                    <div className='flex justify-between w-full'>
                        <h2>Minhas Compras</h2>
                        <div className='rounded-full'>
                            <LargeButton color='blue' loadingButton={ loadingPedidos } onClick={ refreshOrders }><LuRefreshCw /></LargeButton>
                        </div>
                    </div>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex flex-col gap-4 justify-between w-full '>
                            {
                                loadingPedidos && <p>Carregando pedidos...</p>
                            }
                            { pedidos && pedidos?.length > 0 ? listaDeCompras : realizeSuaCompra }
                        </div>
                        <button className='primColor rounded-full p-2 '>Ir para a loja</button>
                    </div>

                </section>
                
                <section className='flex flex-col self-center justify-end bg-yellow-300  h-full'>
                    <button onClick={ handleDeleteMyselfClick } className='bg-red-500 text-white p-2'>Excluir minha conta</button>
                    <p className='text-red-600'>{ deleteUserError }</p>
                </section>
            </div>
            { deleteUseForm && <DeleteMySelfForm showForm={ setDeleteUseForm }/> }
        </main>
    );
}