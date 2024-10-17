// app/minha-conta/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import { useManageOrders } from '../hooks/useManageOrders';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import CustomerInfo from './CustomerInfo';
import DeleteAccountDialog from './DeleteAccountDialog';
import PurchaseCard from './PurchaseCard';

export default function MyProfile() {
    const { user } = useAuthContext();
    const { userInfo } = useUserInfo();
    const router = useRouter();
    const { loadingPedidos, pedidos, refreshOrders } = useManageOrders(user);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 640);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!userInfo) {
            console.log('MINHA CONTA NÂO TEM USUÁRIO', userInfo);
            router.push('/login');
        }
        console.log('MINHA CONTA USERINFO', userInfo);

    }, []);

    const RealizeSuaCompra = () => (
        <div className='flex flex-col items-center gap-2 w-full'>
            <FiShoppingCart className='textColored' size={ 24 }/>
            <h3>Realize sua primeira compra</h3>
        </div>
    );

    const OrderList = () => (
        <div className="space-y-6">
            { pedidos && pedidos.map((pedido) => (
                <PurchaseCard key={ pedido.id } pedido={ pedido } isLargeScreen={ isLargeScreen } />
            )) }
        </div>
    );

    if(!userInfo) {
        return (
            <h1>Loading...</h1>
        );
    }

    return (
        <main className='min-h-screen text-[#333333] md:py-6 px-2 md:px-8'>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl sm:text-4xl font-bold">Minha Conta</h1>
                    <Button
                        className="text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white w-full sm:w-auto md:text-lg"
                        onClick={ () => router.push('/') }
                        variant="outline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Página Inicial
                    </Button>
                </div>

                <div className='flex flex-col w-full gap-4'>
                    <CustomerInfo userInfo={ userInfo } onEdit={ () => {} }/>
                    <section className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                            <h2 className="text-2xl font-semibold">Minhas Compras</h2>
                            <Button
                                className="text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white w-full sm:w-auto md:text-lg"
                                onClick={ refreshOrders }
                                variant="outline"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                    Atualizar Pedidos
                            </Button>
                        </div>

                        { loadingPedidos && <p>Carregando pedidos...</p> }

                        { pedidos && pedidos?.length > 0 ? <OrderList /> : <RealizeSuaCompra /> }

                    </section>
                </div>
                { userInfo && <div className='bg-yellow w-full flex justify-end'><DeleteAccountDialog userInfo={ userInfo }/></div> }
            </div>
        </main>
    );
}