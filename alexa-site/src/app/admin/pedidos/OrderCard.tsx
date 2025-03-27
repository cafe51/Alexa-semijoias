// OrderCard.tsx

import { useCollection } from '@/app/hooks/useCollection';
import { formatPrice } from '@/app/utils/formatPrice';
import { statusButtonTextColorMap } from '@/app/utils/statusButtonTextColorMap';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { useEffect, useState } from 'react';

interface OrderCardProps {
    pedido: OrderType & FireBaseDocument;
    handleSelectOrder: (order: OrderType & FireBaseDocument, user: UserType & FireBaseDocument) => void;
}

export default function OrderCard({ pedido, handleSelectOrder }: OrderCardProps){
    const { getDocumentById } = useCollection<UserType>('usuarios');
    const [user, setUser] = useState<(UserType & FireBaseDocument) | null>(null);

    useEffect(() => {
        async function getUser() {
            if(pedido) {
                const res = await getDocumentById(pedido.userId);
                setUser(res);
            }
        }
        getUser();
    }, []);

    if(!user || !pedido) return <p>Loading...</p>;

    const taxaDeParcelamento = 3.98;

    const jurosGenerator = (installments: number) => {
        switch (installments) {
        case 2:
            return 2.53 + taxaDeParcelamento;
        case 3:
            return 4.62 + taxaDeParcelamento;
        case 4:
            return 6.69 + taxaDeParcelamento;
        case 5:
            return 8.66 + taxaDeParcelamento;
        case 6:
            return 9.96 + taxaDeParcelamento;
        default:
            return 0;
        }
    };
    const juroPix = 4;
    const fixedFrete = 80;
    const custo = pedido.cartSnapShot.map(({ value: { cost } }) => cost).reduce((a, b) => a + b, 0);
    const valorDaCompra = pedido.valor.soma;
    const juros = pedido.installments ? jurosGenerator(pedido.installments) : 0;
    const valorDoJuro = juros === 0 ? undefined : parseFloat((valorDaCompra * (juros/100)).toFixed(2));
    const valorDoJuroDoPix = valorDaCompra * (juroPix/100);
    const valorRecebido = ((juros > 0) && (valorDoJuro)) ? (parseFloat((valorDaCompra - valorDoJuro).toFixed(2))) : pedido.paymentOption === 'pix' ? (parseFloat((valorDaCompra - valorDoJuroDoPix).toFixed(2))) : undefined;

    const lucro = valorRecebido ? parseFloat((valorRecebido - custo).toFixed(2)) : parseFloat((pedido.valor.soma - custo).toFixed(2));



    return (
        <div className="flex flex-col items-end border-b pb-4 gap-4 bg-white" onClick={ () => handleSelectOrder(pedido, user) }>
            <div className='flex justify-between w-full text-center text-xs p-2  bg-gray-200'>
                <p>
                    { 
                    // converter pedido.date do tipo Timestamp do firebase para um formato possível de ser renderizado e legível para o usuário
                        pedido.updatedAt.toDate().toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })
                    }
                </p>

                <p className= { `${ statusButtonTextColorMap[pedido.status] }` }>{ pedido.status }</p>

                <p>
                    {
                        formatPrice(pedido?.valor.soma) + ((valorDaCompra && pedido.installments) &&
                    (' - ' + (pedido.paymentOption === 'pix' ? 4 : jurosGenerator(pedido.installments)))+ '%' + ' = ')
                    }
                    <span className='font-bold'>{ valorDaCompra && formatPrice(valorRecebido) }</span>
                </p>
            </div>
            <div className="flex justify-between  px-2 gap-4 w-full items-start">
                <div className='flex flex-col'>
                    <p>{ user.nome } </p>
                    <p><span>quantidade:</span> <span className='font-bold'>{ pedido.totalQuantity }</span></p>
                    <p>Custo: <span className='font-bold'>{ formatPrice(custo) }</span></p>
                    <p>Frete: <span className='font-bold'>{ formatPrice(fixedFrete) }</span></p>
                    <p>Lucro: <span className='font-bold'>{ formatPrice(parseFloat((lucro - fixedFrete).toFixed(2))) }</span></p>


                </div>
                <div className='flex flex-col'>
                    <p>{ (pedido.installments && pedido.paymentOption !== 'pix') ? `${pedido.installments + 'x ' + pedido.paymentOption}` : pedido.paymentOption }</p>
                    <p>{ pedido.deliveryOption.name }</p>
                </div>
            </div>
        </div>
    );
}
