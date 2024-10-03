// src/app/hooks/usePaymentProcessing.ts

import { IPaymentFormData } from '@mercadopago/sdk-react/bricks/payment/type';
import { IBrickError } from '@mercadopago/sdk-react/bricks/util/types/common';
import axios from 'axios';
import { FireBaseDocument, OrderType, PaymentResponseType, ProductCartType, UseCheckoutStateType, UserType } from '../utils/types';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useManageProductStock } from '../hooks/useManageProductStock';
import { useCollection } from '../hooks/useCollection';

export const usePaymentProcessing = () => {
    const router = useRouter();
    const { addDocument: createNewOrder } = useCollection<OrderType>('pedidos');
    const { deleteDocument: deleteCartItemFromDb } = useCollection<ProductCartType>('carrinhos');
    const { updateTheProductDocumentStock } = useManageProductStock();

    const cancelPayment = async(paymentId: string) => {
        try {
            const response = await axios.put(
                `/api/cancel_payment/${paymentId}`,
                { status: 'cancelled' },
                { headers: { 'Content-Type': 'application/json' } },
            );

            if (response.status === 200) {
                console.log('Pagamento cancelado com sucesso:', paymentId);
            } else {
                console.error('Falha ao cancelar o pagamento:', paymentId);
                throw new Error('Falha ao cancelar o pagamento');
            }
        } catch (error) {
            console.error('Erro ao cancelar o pagamento:', error);
            throw error;
        }
    };

    const finishPayment = async(
        paymentId: string,
        selectedPaymentOption: string,
        totalAmount: number,
        user: UserType & FireBaseDocument,
        state: UseCheckoutStateType,
        carrinho: ProductCartType[],
        pixPaymentResponse?: PaymentResponseType,
    ) => {
        const { address, deliveryOption, selectedDeliveryOption } = state;
        const deliveryPrice = deliveryOption?.price || 0;
        const totalQuantity = carrinho.map((items) => Number(items.quantidade)).reduce((a, b) => a + b, 0) || 0;

        if (!user || !carrinho || !address || !deliveryOption || !selectedDeliveryOption) {
            throw new Error('Dados de pagamento incompletos');
        }

        const newOrder: OrderType = {
            endereco: address,
            cartSnapShot: carrinho,
            status: 'aguardando pagamento',
            userId: user.id,
            valor: {
                frete: deliveryPrice,
                soma: totalAmount || 0,
                total: (totalAmount || 0) + deliveryPrice,
            },
            totalQuantity,
            paymentOption: selectedPaymentOption,
            deliveryOption: selectedDeliveryOption,
            pixResponse: pixPaymentResponse,
            paymentId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        try {
            await createNewOrder(newOrder, paymentId);
            await Promise.all(
                carrinho.map((item) =>
                    updateTheProductDocumentStock(item.productId, item.skuId, item.quantidade, '-'),
                ),
            );

            await Promise.all(
                carrinho.map((item) => {
                    const { id } = item as ProductCartType & FireBaseDocument;
                    return deleteCartItemFromDb(id);
                }),
            );

            console.log('Pedido finalizado com sucesso');
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            throw error;
        }
    };

    const onSubmit = async(
        params: IPaymentFormData,
        totalAmount: number,
        user: UserType & FireBaseDocument,
        state: UseCheckoutStateType,
        carrinho: ProductCartType[],
    ) => {
        try {
            const response = await axios.post('/api/process_payment', params.formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            const paymentId = response.data.id.toString();

            if (response.data.payment_method_id === 'pix') {
                const pixPaymentResponse = {
                    qrCode: response.data.point_of_interaction.transaction_data.qr_code,
                    qrCodeBase64: response.data.point_of_interaction.transaction_data.qr_code_base64,
                    ticketUrl: response.data.point_of_interaction.transaction_data.ticket_url,
                };
                try {
                    await finishPayment(paymentId, response.data.payment_method_id, totalAmount, user, state, carrinho, pixPaymentResponse);
                    router.push(`/pedido/${paymentId}`);
                } catch (error) {
                    console.error('Erro ao finalizar o pagamento:', error);
                    await cancelPayment(paymentId);
                }
            } else {
                try {
                    await finishPayment(paymentId, response.data.payment_method_id, totalAmount, user, state, carrinho);
                    router.push(`/pedido/${paymentId}`);
                } catch (error) {
                    console.error('Erro ao finalizar o pagamento:', error);
                    await cancelPayment(paymentId);
                }
            }
        } catch (error) {
            console.error('Erro ao processar o pagamento:', error);
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
        cancelPayment,
        onError,
        onReady,
    };
};
