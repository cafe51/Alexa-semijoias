// src/app/hooks/usePaymentProcessing.ts

import { IPaymentFormData } from '@mercadopago/sdk-react/bricks/payment/type';
import { IBrickError } from '@mercadopago/sdk-react/bricks/util/types/common';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { FireBaseDocument, OrderType, PixPaymentResponseType, ProductCartType, StatusType, UseCheckoutStateType, UserType } from '../utils/types';
import { useRouter } from 'next/navigation';
import { useManageProductStock } from '../hooks/useManageProductStock';
import { useCollection } from '../hooks/useCollection';
import { createPayment, sendEmailConfirmation } from '../utils/apiCall';
import { handlePaymentFailure } from '../utils/paymentStatusHandler';
import { createAdditionalInfo, createNewOrderObject, createPayer, createPayerAddInfo } from '../utils/orderHelpers';

export const usePaymentProcessing = (setIsPaymentFinished: (isPaymentFinished: boolean) => void) => {
    const router = useRouter();
    const { addDocument: createNewOrder, getDocumentById: getOrderById } = useCollection<OrderType>('pedidos');
    const { updateTheProductDocumentStock } = useManageProductStock();

    const finishPayment = async(
        orderStatus: StatusType,
        paymentId: string,
        selectedPaymentOption: string,
        installments: OrderType['installments'],
        totalAmount: number,
        user: UserType & FireBaseDocument,
        state: UseCheckoutStateType,
        carrinho: ProductCartType[],
        setLoadingPayment: (isPaymentLoading: boolean) => void,
        pixPaymentResponse?: PixPaymentResponseType,
    ) => {
        const { address, deliveryOption, selectedDeliveryOption } = state;

        if (!user || !carrinho || !address || !deliveryOption || !selectedDeliveryOption) {
            throw new Error('Dados de pagamento incompletos');
        }

        const newOrder = createNewOrderObject(
            orderStatus,
            paymentId,
            selectedPaymentOption,
            installments,
            totalAmount,
            user,
            carrinho,
            address,
            deliveryOption,
            selectedDeliveryOption,
            pixPaymentResponse,
        );

        try {
            await createNewOrder(newOrder, paymentId);

            for (const cartItem of carrinho) {
                const { productId, skuId, quantidade } = cartItem as ProductCartType & FireBaseDocument;
                await updateTheProductDocumentStock(productId, skuId, quantidade, '-');
            }


            console.log('Pedido finalizado com sucesso');
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            throw error;
        } finally {
            setIsPaymentFinished(true);
            setLoadingPayment(false);
            router.push(`/pedido/${paymentId}`);
        }
    };

    const onSubmit = async(
        params: IPaymentFormData,
        totalAmount: number,
        user: UserType & FireBaseDocument,
        state: UseCheckoutStateType,
        carrinho: ProductCartType[],
        setShowPaymentFailSection: (showPaymentFailSection: boolean | string) => void,
        setShowPaymentSection: (showPaymentSection: boolean) => void,
        setLoadingPayment: (isPaymentLoading: boolean) => void,
    ): Promise<void> => {

        try {
            const payerAddInfo = createPayerAddInfo(user);

            const payer = createPayer(user);

            const additionalInfo = createAdditionalInfo(carrinho, payerAddInfo, user);

            const createPaymentResponse = await createPayment(params, user, payer, additionalInfo);

            const paymentResponse: PaymentResponse = createPaymentResponse.data;

            if(!paymentResponse.id) {
                throw new Error('Payment ID not found');
            }

            if (!paymentResponse.status) {
                throw new Error('Payment status not found');
            }
            
            if (!paymentResponse.payment_method_id) {
                throw new Error('Payment method not found');
            }

            if (paymentResponse.status === 'rejected') {
                // Chama a função para lidar com o erro
                setLoadingPayment(false);
                handlePaymentFailure(paymentResponse.status_detail, setShowPaymentFailSection, setShowPaymentSection);
                return;
            }

            const paymentId: string = paymentResponse.id.toString();

            let orderStatus: StatusType = 'preparando para o envio';
            if(['pending', 'in_process', 'authorized'].includes(paymentResponse.status)) {
                orderStatus = 'aguardando pagamento';
            }
            const pixPaymentResponse = paymentResponse.point_of_interaction ? {
                qrCode: paymentResponse.point_of_interaction.transaction_data?.qr_code || '',
                qrCodeBase64: paymentResponse.point_of_interaction.transaction_data?.qr_code_base64 || '',
                ticketUrl: paymentResponse.point_of_interaction.transaction_data?.ticket_url || '',
            } : undefined;
            // "payment_type_id": "credit_card"
            await finishPayment(
                orderStatus,
                paymentId,
                (
                    paymentResponse.payment_type_id 
                        ? ((paymentResponse.payment_type_id === 'credit_card') ? 'cartão de crédito' : 'pix')
                        : 'error'
                ) ,
                paymentResponse.installments ? paymentResponse.installments : null,
                totalAmount,
                user,
                state,
                carrinho,
                setLoadingPayment,
                pixPaymentResponse,
            );

            if(paymentResponse.payment_type_id && paymentResponse.payment_type_id !== 'credit_card') {
                const order = await getOrderById(paymentId);
                await sendEmailConfirmation(order, user);
            }

        } catch (error) {
            console.error('Erro ao processar o pagamento:', error);
            throw error; // Propaga o erro para ser tratado pelo componente
        }
    };

    const onError = (error: IBrickError) => {
        console.error(error);
    };

    const onReady = () => {
    // Callback chamado quando o Brick estiver pronto
    };

    return {
        onSubmit,
        finishPayment,
        onError,
        onReady,
    };
};
