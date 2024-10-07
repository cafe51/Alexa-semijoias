import AccountSectionFilled from '@/app/checkout/AccountSection/AccountSectionFilled';
import AddressSectionFilled from '@/app/checkout/AddressSection/AddressSectionFilled';
import PriceSummarySection from '@/app/checkout/OrderSummarySection/PriceSummarySection';
import SummaryCard from '@/app/checkout/OrderSummarySection/SummaryCard';
import { FireBaseDocument, OrderType,  StatusType, UserType } from '@/app/utils/types';
import ChangeStatus from './ChangeStatus';
import { useEffect, useState } from 'react';
import CancelOrderButton from './CancelOrderButton';
import { statusButtonTextColorMap } from '@/app/utils/statusButtonTextColorMap';
import PixPayment from '@/app/components/PixPayment';
import TryNewOrderButton from './TryNewOrderButton';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import LargeButton from '@/app/components/LargeButton';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { usePaymentProcessing } from '@/app/hooks/usePaymentProcessing';

interface OrderDetailsProps {
    pedido: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
    admin?: boolean;
}

export default function OrderDetails({ pedido, user: { cpf, email, nome, tel }, admin=false }: OrderDetailsProps) {
    const { userInfo } = useUserInfo();
    const [modalConfirmationRetryOrder, setShowModalConfirmationRetryOrder] = useState(false);
    const [pedidoState, setPedidoState] = useState(pedido);
    const [status, setStatus] = useState<StatusType>(pedido.status);
    const [showPixPayment, setShowPixPayment] = useState(false);
    const { cancelPayment } = usePaymentProcessing();


    useEffect(() => {
        const conditionsToShowPixPayment = pedidoState.status === 'aguardando pagamento'
        && pedidoState.pixResponse && pedidoState.pixResponse.qrCode.length > 0
        && status === 'aguardando pagamento';
        if (conditionsToShowPixPayment) {
            setShowPixPayment(true);
        } else {
            setShowPixPayment(false);
        }
    }, [pedidoState.pixResponse, pedidoState.status, status]);

    useEffect(() => {
        setStatus(pedido.status);
    }, [pedido.status]);

    useEffect(() => {
        setPedidoState(pedido);
    }, [pedido]);

    return (
        <div className="flex flex-col gap-2 text-sm ">
            {
                modalConfirmationRetryOrder
                && <ModalMaker closeModelClick={ () => setShowModalConfirmationRetryOrder(false) } title='Refazer Pedido'>
                    <section className='flex flex-col *:text-center *:p-2 w-full'>
                        <p>Deseja cancelar esse pedido e refazê-lo?</p>
                        <div className='flex justify-between w-full p-4'>
                            <div onClick={ () => {
                                cancelPayment(pedido.id);
                                setStatus('cancelado');
                                setShowModalConfirmationRetryOrder(false);
                            } }>
                                <TryNewOrderButton cartSnapShot={ pedidoState.cartSnapShot }/>
                            </div>
                            <div>
                                <LargeButton color='red' onClick={ () => setShowModalConfirmationRetryOrder(false) }>Cancelar</LargeButton>
                            </div>
                        </div>
                    </section>

                </ModalMaker>
            }
            {
                (pedidoState.status === 'aguardando pagamento')
                && userInfo?.userId === pedido.userId 
                && <LargeButton color='green' onClick={ () => setShowModalConfirmationRetryOrder(true) }>Refazer Pedido</LargeButton>
            }
            {
                (pedidoState.status === 'cancelado')
                && userInfo?.userId === pedido.userId 
                && <TryNewOrderButton cartSnapShot={ pedidoState.cartSnapShot }/>
            }
            <div className='w-full p-2 text-center'>
                {
                    pedidoState.status !== 'cancelado' && pedidoState.status !== 'aguardando pagamento' && <h2 className= 'text-green-500 w-full bg-gray-200 p-4'>Pagamento Aprovado</h2>
                }
                <h2 className= { `p-4 ${ statusButtonTextColorMap[pedidoState.status] }` }>{ status }</h2>
            </div>
            {
                pedidoState.pixResponse && showPixPayment &&
                <PixPayment
                    pixKey={ pedidoState.pixResponse.qrCode }
                    qrCodeBase64={ pedidoState.pixResponse.qrCodeBase64 }
                    ticketUrl={ pedidoState.pixResponse.ticketUrl }
                />
            }
            {
                admin && <ChangeStatus
                    pedidoId={ pedido.id }
                    initialStatus={ pedidoState.status }
                    changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
                />
            }
            <AccountSectionFilled
                cpf={ cpf }
                email={ email }
                nome={ nome }
                telefone={ tel }
                adminDashboard
            />

            <AddressSectionFilled address={ pedido.endereco } />
            {
                admin && status !== 'entregue' && status !== 'cancelado' && <CancelOrderButton pedido={ pedido } changeStatus={ () => setStatus('cancelado') }/>
            }
            <PriceSummarySection
                frete={ pedido.valor.frete }
                subtotalPrice={ pedido.valor.soma }
                adminDashboard

            />
            <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                { pedidoState.cartSnapShot && pedido.cartSnapShot.length > 0 ? pedidoState.cartSnapShot.map((produto) => {
                    if (produto && produto.quantidade && produto.quantidade > 0) {
                        return <SummaryCard key={ produto.skuId } produto={ produto } />;
                    } else return false;
                }) : <span>Loading...</span> }
            </section>
        </div>
    );
}