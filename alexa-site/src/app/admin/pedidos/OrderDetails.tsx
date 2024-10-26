import { FireBaseDocument, OrderType,  StatusType, UserType } from '@/app/utils/types';
import ChangeStatus from './ChangeStatus';
import { useEffect, useState } from 'react';
import CancelOrderButton from './CancelOrderButton';
import PixPayment from '@/app/components/PixPayment';
import TryNewOrderButton from './TryNewOrderButton';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { usePaymentProcessing } from '@/app/hooks/usePaymentProcessing';
import CustomerInfo from './CustomerInfo';
import PaymentSummary from './PaymentSummary';
import DeliveryAddress from './DeliveryAddress';
import OrderItems from './OrderItems';
import OrderStatus from './OrderStatus';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw } from 'lucide-react';

interface OrderDetailsProps {
    pedido: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
    admin?: boolean;
}

export default function OrderDetails({ pedido, user: { email, nome, phone }, admin=false }: OrderDetailsProps) {
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
        <div className="flex flex-col gap-2 text-sm md:text-lg">
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
                                <Button
                                    variant="outline"
                                    className="bg-white text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white flex-1"
                                    onClick={ () => setShowModalConfirmationRetryOrder(false) }
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                Cancelar
                                </Button>
                            </div>
                        </div>
                    </section>

                </ModalMaker>
            }
            
            {
                (pedidoState.status === 'cancelado')
                && userInfo?.userId === pedido.userId 
                && <TryNewOrderButton cartSnapShot={ pedidoState.cartSnapShot }/>
            }

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <OrderStatus order={ pedidoState } />
                {
                    pedidoState.pixResponse && showPixPayment &&
                <PixPayment
                    pixKey={ pedidoState.pixResponse.qrCode }
                    qrCodeBase64={ pedidoState.pixResponse.qrCodeBase64 }
                    startDate={ pedidoState.updatedAt.toDate() }
                    // ticketUrl={ pedidoState.pixResponse.ticketUrl }
                />
                }

                {
                    admin && <ChangeStatus
                        pedidoId={ pedido.id }
                        initialStatus={ pedidoState.status }
                        changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
                    />
                }

                <CustomerInfo
                    email={ email }
                    name={ nome }
                    phone={ phone }
                />

                <DeliveryAddress address={ pedido.endereco } />

                <PaymentSummary
                    frete={ pedido.valor.frete }
                    subtotalPrice={ pedido.valor.soma }
                    installments={ pedido.installments }
                    paymentOption={ pedido.paymentOption }

                />
                <OrderItems cartSnapShot={ pedido.cartSnapShot } />
            </div>
            {
                admin && status !== 'entregue' && status !== 'cancelado' && <CancelOrderButton pedido={ pedido } changeStatus={ () => setStatus('cancelado') }/>
            }
            {
                (pedidoState.status === 'aguardando pagamento')
                && userInfo?.userId === pedido.userId 
                && <Button className="bg-[#D4AF37] text-white hover:bg-[#C48B9F] flex-1 md:text-2xl" onClick={ () => setShowModalConfirmationRetryOrder(true) }>
                    <RefreshCw className="mr-2 h-4 w-4 md:h-6 md:w-6 lg:h-6 lg:w-6" />
        Refazer Pedido
                </Button>
            }
        </div>
    );
}