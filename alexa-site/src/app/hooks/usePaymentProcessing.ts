// src/app/hooks/usePaymentProcessing.ts
'use client';
import { IPaymentFormData } from '@mercadopago/sdk-react/bricks/payment/type';
import { IBrickError } from '@mercadopago/sdk-react/bricks/util/types/common';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { CouponType, FireBaseDocument, OrderType, PixPaymentResponseType, ProductCartType, StatusType, UseCheckoutStateType, UserType } from '../utils/types';
import { useRouter } from 'next/navigation';
import { useManageProductStock } from '../hooks/useManageProductStock';
import { useCollection } from '../hooks/useCollection';
import { MetaConversionsService } from '../utils/meta-conversions/service';
import { createPayment, sendEmailConfirmation } from '../utils/apiCall';
import { handlePaymentFailure } from '../utils/paymentStatusHandler';
import { createAdditionalInfo, createNewOrderObject, createPayer, createPayerAddInfo } from '../utils/orderHelpers';
import { Timestamp } from 'firebase/firestore';
import { sendGTMEvent } from '../utils/analytics';

export const usePaymentProcessing = (setIsPaymentFinished: (isPaymentFinished: boolean) => void) => {
    const router = useRouter();
    const { addDocument: createNewOrder, getDocumentById: getOrderById } = useCollection<OrderType>('pedidos');
    const { updateDocumentField: updateCouponDoc, getDocumentById: getCouponById } = useCollection<CouponType>('cupons');


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
        couponId?: string,
    ) => {
        const { address, deliveryOption } = state;

        if (!user || !carrinho || !address || !deliveryOption) {
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
            pixPaymentResponse,
            couponId,
        );

        try {
            await createNewOrder(newOrder, paymentId);
            console.log('XXXXXXXXXXXXXXx');
            console.log('couponId.length', couponId!.length > 0);
            for (const cartItem of carrinho) {
                const { productId, skuId, quantidade } = cartItem as ProductCartType & FireBaseDocument;
                await updateTheProductDocumentStock(productId, skuId, quantidade, '-');
            }
            if(couponId && couponId.length > 0) {
                const coupon = await getCouponById(couponId);
                console.log('XXXXXXXXXXXXXXxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx');
                console.log('coupon', coupon);
                if(coupon) {
                    if (coupon.limiteUsoGlobal !== null && coupon.limiteUsoGlobal > 0) {
                        // Atualiza o limite de uso global do cupom
                        updateCouponDoc(couponId, 'atualizadoEm', Timestamp.now());
                        updateCouponDoc(couponId, 'limiteUsoGlobal', coupon.limiteUsoGlobal - 1);
                    }
                }
            }

            console.log('Pedido finalizado com sucesso');

            // Envia evento de compra para a API de Conversões da Meta
            await MetaConversionsService.getInstance().sendPurchase({
                order: newOrder,
                url: window.location.href,
            }).catch(error => {
                console.error('Failed to send Purchase event to Meta Conversions API:', error);
            });

        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            throw error;
        } finally {
            sendGTMEvent('purchase', {
                ecommerce: {
                    transaction_id: newOrder.paymentId, // ID ÚNICO da transação/pedido (MUITO IMPORTANTE)
                    value: newOrder.valor.total, // Valor TOTAL da transação (incluindo frete e impostos)
                    shipping: newOrder.valor.frete || 0, // Valor do frete
                    currency: 'BRL',
                    // coupon: newOrder.couponCode, // Se usou cupom
                    items: newOrder.cartSnapShot.map((item) => ({ // Mapeia cada item do pedido
                        item_id: item.skuId, // MESMO ID/SKU consistente
                        item_name: item.name,
                        item_brand: 'Alexa Semijoias',
                        price: item.value.promotionalPrice ? item.value.promotionalPrice : item.value.price, // Preço do item
                        quantity: item.quantidade, // Quantidade COMPRADA deste item
                    })),
                },
            });

            // // ADICIONE o envio DIRETO para Google Ads
            // if (window.gtag) { // Verifica se gtag está disponível
            //     window.gtag('event', 'conversion', {
            //         'send_to': 'AW-16844313988/TljPCLHE_LgaEISr_98-', // SEU 'send_to' específico
            //         'value': newOrder.valor.total, // Valor DINÂMICO da transação
            //         'currency': 'BRL', // Moeda
            //         'transaction_id': newOrder.paymentId, // ID DINÂMICO da transação
            //     });
            //     console.log('Disparado evento de conversão direto para Google Ads');
            // } else {
            //     console.warn('gtag function not found for Ads conversion snippet.');
            // }

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
        couponId?: string,
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
                couponId,

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
