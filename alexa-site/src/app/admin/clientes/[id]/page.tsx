'use client';
import { useCollection } from '@/app/hooks/useCollection';
import CardOrder from '@/app/minha-conta/CardOrder';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientProfile({ params }: { params: { id: string } }) {
    const pathname = usePathname();
    const [userData, setUserData ] = useState<(UserType & FireBaseDocument) | null>(null);
    const [userOrders, setUserOrders] = useState<(OrderType & FireBaseDocument)[] | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const { getDocumentById } = useCollection<UserType>('usuarios');
    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    // const userQuery = useMemo<FilterOption[]>(() => 
    //     [{ field: 'userId', operator: '==', value: userData ? userData.userId : 'invalidId' }],
    // [userData], // Só recriar a query quando 'user' mudar
    // );

    useEffect(() => {
        async function getUserData() {
            const res = await getDocumentById(params.id);
            console.log('res', res);

            setUserData(res);
        } 

        getUserData();
    }, [params.id]);

    useEffect(() => {
        async function getUserOrders() {
            if(userData) {
                setTimeout(async() => {
                    console.log('chamou o userDate getAll documents set timeout', userData);
                    const res = await getAllDocuments([{ field: 'userId', operator: '==', value: userData.id }]);
                    setUserOrders(res);
                    setLoadingOrders(false);
    
                }, 1000);
            }
            setLoadingOrders(true);
        }

        getUserOrders();

    }, [userData]);

    function removeLastSegment(pathName: string): string {
        const lastSlashIndex = pathName.lastIndexOf('/');
      
        if (lastSlashIndex === -1) {
            return pathName; // Não há segmento a ser removido
        }
      
        return pathName.slice(0, lastSlashIndex);
    }
    
    const listaDeCompras = (
        userOrders?.map((pedido, index: number) => {
            return (<CardOrder pedido={ pedido } key={ index } />);
        })
    );

    if (!userData) return <p>Loading...</p>;

    return (
        <main className='h-full'>
            <Link href={ `${ removeLastSegment(pathname) }` }>Voltar</Link>
            <h1>Detalhes do cliente { userData.nome }</h1>
            <div className='flex flex-col w-full gap-4'>

                <section className='flex flex-col w-full'>
                    <div className='flex items-center'>
                        <h2>Dados</h2>
                    </div>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex justify-between  p-4 w-full shadow-lg rounded-lg shadowColor bg-white '>
                        <div className='flex flex-col gap-1'>
                            <h3>{ userData.nome }</h3>
                            <h3>{ userData.email }</h3>
                            <h3>{ userData.phone }</h3>
                        </div>
                        <span className='textColored'>Editar</span>
                    </div>
                </section>

                <section className='flex flex-col w-full'>
                    <h2>Minhas Compras</h2>
                    <div className='w-full border-2 border-solid border-pink-100'></div>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex flex-col gap-4 justify-between w-full '>
                            { 
                                loadingOrders
                                    ?
                                    <p>carregando pedidos...</p>
                                    :
                                    (userOrders && userOrders?.length > 0 ? listaDeCompras : <h1>Nenhum pedido</h1>)
                            }
                        </div>
                        <button className='primColor rounded-full p-2 '>Ir para a loja</button>
                    </div>

                </section>
            </div>
        </main>
    );
}