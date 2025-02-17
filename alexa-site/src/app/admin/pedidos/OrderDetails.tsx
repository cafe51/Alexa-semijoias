import { FireBaseDocument, OrderType,  StatusType, UserType } from '@/app/utils/types';
import ChangeStatus from './ChangeStatus';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CancelOrderButton from './CancelOrderButton';
import TryNewOrderButton from './TryNewOrderButton';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import CustomerInfo from './CustomerInfo';
import PaymentSummary from './PaymentSummary';
import DeliveryAddress from './DeliveryAddress';
import OrderItems from './OrderItems';
import OrderStatus from './OrderStatus';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw } from 'lucide-react';
import { useWindowSize } from '@/app/hooks/useWindowSize';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import PixPayment from './pixPaymentSection/PixPayment';
import GenerateRomaneioButton from '@/app/components/GenerateRomaneioButton';
import { detalhesDaEmpresa } from '@/app/utils/detalhesDaEmpresa';

interface OrderDetailsProps {
    pedido: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
    admin?: boolean;
    setLoadingState: Dispatch<SetStateAction<boolean>>;
    loadingState: boolean
}

export default function OrderDetails({ pedido, user, setLoadingState, loadingState, admin=false }: OrderDetailsProps) {
    const { email, nome, phone } = user;
    const { screenSize } = useWindowSize();
    const { userInfo } = useUserInfo();
    const [modalConfirmationRetryOrder, setShowModalConfirmationRetryOrder] = useState(false);
    const [pedidoState, setPedidoState] = useState(pedido);
    const [status, setStatus] = useState<StatusType>(pedido.status);
    const [showPixPayment, setShowPixPayment] = useState(false);

    useEffect(() => {
        const conditionsToShowPixPayment = (pedidoState.status === 'aguardando pagamento' || pedidoState.status === 'cancelado')
        && pedidoState.pixResponse && pedidoState.pixResponse.qrCode.length > 0
        && (status === 'aguardando pagamento' || status === 'cancelado');
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
        setLoadingState(true);
        setPedidoState(pedido);
        setLoadingState(false);

    }, [pedido]);

    if(loadingState) return (
        <section className='flex flex-col items-center justify-center h-3/6'>
            <LoadingIndicator />
        </section>
    );

    return (
        <div className="flex flex-col gap-2 h-min-h-screen text-sm md:text-lg justify-center items-center my-4 lg:my-16 px-4 md:px-8">
            {
                modalConfirmationRetryOrder
                && <ModalMaker closeModelClick={ () => setShowModalConfirmationRetryOrder(false) } title='Refazer Pedido'>
                    <section className='flex flex-col *:text-center *:p-2 w-full'>
                        {
                            status === 'cancelado'
                                ? <p>Deseja refazer esse pedido?</p>
                                :
                                <p>Deseja cancelar esse pedido e refazê-lo?</p>
                        }
                        <div className='flex justify-between w-full p-4'>
                            <div onClick={ async() => {
                                setStatus('cancelado');
                                setShowModalConfirmationRetryOrder(false);
                            } }>
                                <TryNewOrderButton pedidoState={ pedidoState } setLoadingState={ setLoadingState } />
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    className="bg-white text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white flex-1"
                                    onClick={ () => setShowModalConfirmationRetryOrder(false) }
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                Voltar
                                </Button>
                            </div>
                        </div>
                    </section>
                </ModalMaker>
            }
            
            {
                (pedidoState.status === 'cancelado' || pedidoState.status === 'entregue')
                && userInfo?.userId === pedido.userId 
                && <TryNewOrderButton pedidoState={ pedidoState } setLoadingState={ setLoadingState }/>
            }

            { screenSize === 'mobile' ? (
                // Layout Mobile - Uma coluna
                <div className="flex flex-col space-y-6 w-full">
                    { admin && (
                        <GenerateRomaneioButton
                            order={ pedidoState }
                            user={ user }
                            dadosDaEmpresa={ detalhesDaEmpresa }
                        />
                    ) }
                    <OrderStatus order={ pedidoState } />
                    { admin && (
                        <ChangeStatus
                            pedido={ pedido }
                            initialStatus={ pedidoState.status }
                            changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
                        />
                    ) }
                    {
                        pedidoState.pixResponse && showPixPayment &&
                        (
                            <PixPayment
                                pixKey={ pedidoState.pixResponse.qrCode }
                                qrCodeBase64={ pedidoState.pixResponse.qrCodeBase64 }
                                startDate={ pedidoState.createdAt.toDate() }
                                cancelStatus={ () => {
                                    setStatus('cancelado');
                                } }
                            />
                        )
                    }
                    <PaymentSummary
                        frete={ pedido.valor.frete }
                        subtotalPrice={ pedido.valor.soma }
                        installments={ pedido.installments }
                        paymentOption={ pedido.paymentOption }
                    />
                    <OrderItems cartSnapShot={ pedido.cartSnapShot } />
                    <DeliveryAddress address={ pedido.endereco } />
                    <CustomerInfo
                        email={ email }
                        name={ nome }
                        phone={ phone }
                    />
                </div>
            ) : screenSize === 'medium' ? (
                // Layout Medium - Duas colunas com OrderStatus no topo
                <div className="flex flex-col space-y-6 w-full">
                    <div className="w-full">
                        <OrderStatus order={ pedidoState } />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        { /* Coluna 1 - Outros componentes */ }
                        <div className="flex flex-col space-y-6">
                            { admin && (
                                <ChangeStatus
                                    pedido={ pedido }
                                    initialStatus={ pedidoState.status }
                                    changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
                                />
                            ) }
                            { admin && (
                                <GenerateRomaneioButton
                                    order={ pedidoState }
                                    user={ user }
                                    dadosDaEmpresa={ detalhesDaEmpresa }
                                />
                            ) }
                            <PaymentSummary
                                frete={ pedido.valor.frete }
                                subtotalPrice={ pedido.valor.soma }
                                installments={ pedido.installments }
                                paymentOption={ pedido.paymentOption }
                            />
                            {
                                pedidoState.pixResponse && showPixPayment &&
                                (
                                    <PixPayment
                                        pixKey={ pedidoState.pixResponse.qrCode }
                                        qrCodeBase64={ pedidoState.pixResponse.qrCodeBase64 }
                                        startDate={ pedidoState.updatedAt.toDate() }
                                        cancelStatus={ () => {
                                            setStatus('cancelado');
                                        } }
                                    />
                                )
                            }
                            <DeliveryAddress address={ pedido.endereco } />
                            <CustomerInfo
                                email={ email }
                                name={ nome }
                                phone={ phone }
                            />
                        </div>
                        { /* Coluna 2 - OrderItems */ }
                        <div>
                            <OrderItems cartSnapShot={ pedido.cartSnapShot } />
                        </div>
                    </div>
                </div>
            ) : (
                // Layout Desktop - Mantendo o layout original em três colunas
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className='flex flex-col lg:gap-8'>
                        { admin && (
                            <GenerateRomaneioButton
                                order={ pedidoState }
                                user={ user }
                                dadosDaEmpresa={ detalhesDaEmpresa }
                            />
                        ) }
                        <OrderStatus order={ pedidoState } />
                        <CustomerInfo
                            email={ email }
                            name={ nome }
                            phone={ phone }
                        />
                        { admin && (
                            <ChangeStatus
                                pedido={ pedido }
                                initialStatus={ pedidoState.status }
                                changeStatus={ (newStatus: StatusType) => setStatus(newStatus) }
                            />
                        ) }

                        <DeliveryAddress address={ pedido.endereco } />
                    </div>
                    <div className='flex flex-col lg:gap-8'>
                        <PaymentSummary
                            frete={ pedido.valor.frete }
                            subtotalPrice={ pedido.valor.soma }
                            installments={ pedido.installments }
                            paymentOption={ pedido.paymentOption }
                        />
                        {
                            pedidoState.pixResponse && showPixPayment &&
                            (
                                <PixPayment
                                    pixKey={ pedidoState.pixResponse.qrCode }
                                    qrCodeBase64={ pedidoState.pixResponse.qrCodeBase64 }
                                    startDate={ pedidoState.updatedAt.toDate() }
                                    cancelStatus={ () => {
                                        setStatus('cancelado');
                                    } }
                                />
                            )
                        }
                    </div>
                    <OrderItems cartSnapShot={ pedido.cartSnapShot } />
                </div>
            ) }

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