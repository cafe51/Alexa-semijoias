import AccountSectionFilled from '@/app/checkout/AccountSection/AccountSectionFilled';
import AddressSectionFilled from '@/app/checkout/AddressSection/AddressSectionFilled';
import PriceSummarySection from '@/app/checkout/OrderSummarySection/PriceSummarySection';
import SummaryCard from '@/app/checkout/OrderSummarySection/SummaryCard';
import { FireBaseDocument, OrderType, StatusType, UserType } from '@/app/utils/types';
import ChangeStatus from './ChangeStatus';
import { useState } from 'react';
import CancelOrderButton from './CancelOrderButton';

interface OrderDetailsProps {
    pedido: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
}


export default function OrderDetails({ pedido, user: { cpf, email, nome, tel } }: OrderDetailsProps) {
    const [status, setStatus] = useState<StatusType>(pedido.status);

    const statusButtonTextColorMap: Record<StatusType, string> = {
        'aguardando pagamento': 'text-yellow-600',
        'preparando para o envio': 'text-blue-500',
        'pedido enviado': 'text-blue-500',
        'cancelado': 'text-red-500',
        'entregue': 'text-green-500',
    };

    return (
        <div className="flex flex-col gap-2 text-sm ">
            <div className='w-full p-2 text-center'>
                <h2 className= { ` ${ statusButtonTextColorMap[status] }` }>{ status }</h2>
            </div>
            <ChangeStatus
                pedidoId={ pedido.id }
                initialStatus={ status }
                changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
            />
            <AccountSectionFilled
                cpf={ cpf }
                email={ email }
                nome={ nome }
                telefone={ tel }
                adminDashboard
            />

            <AddressSectionFilled address={ pedido.endereco } />
            {
                status !== 'entregue' && status !== 'cancelado' && <CancelOrderButton pedido={ pedido } changeStatus={ () => setStatus('cancelado') }/>
            }
            <PriceSummarySection
                frete={ pedido.valor.frete }
                subtotalPrice={ pedido.valor.soma }
                adminDashboard

            />
            <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                { pedido.cartSnapShot && pedido.cartSnapShot.length > 0 ? pedido.cartSnapShot.map((produto) => {
                    if (produto && produto.quantidade && produto.quantidade > 0) {
                        return <SummaryCard key={ produto.skuId } produto={ produto } />;
                    } else return false;
                }) : <span>Loading...</span> }
            </section>
        </div>
    );
}