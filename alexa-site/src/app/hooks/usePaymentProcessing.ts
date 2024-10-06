// src/app/hooks/usePaymentProcessing.ts

import { IPaymentFormData } from '@mercadopago/sdk-react/bricks/payment/type';
import { IBrickError } from '@mercadopago/sdk-react/bricks/util/types/common';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import axios from 'axios';
import { FireBaseDocument, OrderType, PixPaymentResponseType, ProductCartType, StatusType, UseCheckoutStateType, UserType } from '../utils/types';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useManageProductStock } from '../hooks/useManageProductStock';
import { useCollection } from '../hooks/useCollection';
import { nameGenerator } from '../utils/nameGenerator';
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
        orderStatus: StatusType,
        paymentId: string,
        selectedPaymentOption: string,
        totalAmount: number,
        user: UserType & FireBaseDocument,
        state: UseCheckoutStateType,
        carrinho: ProductCartType[],
        pixPaymentResponse?: PixPaymentResponseType,
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
            status: orderStatus,
            userId: user.id,
            valor: {
                frete: deliveryPrice,
                soma: totalAmount || 0,
                total: (totalAmount || 0) + deliveryPrice,
            },
            totalQuantity,
            paymentOption: selectedPaymentOption,
            deliveryOption: selectedDeliveryOption,
            pixResponse: pixPaymentResponse ? pixPaymentResponse : null,
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
        setShowPaymentFailSection: (showPaymentFailSection: boolean | string) => void,
        setShowPaymentSection: (showPaymentSection: boolean) => void,
    ) => {
        try {


            const payerAddInfo = {
                first_name: nameGenerator(user.nome).firstName,
                last_name: nameGenerator(user.nome).lastName,
                phone: {
                    area_code: '92',
                    number: '988065301',
                },
                address: {
                    zip_code: user.address?.cep,
                    street_name: user.address?.logradouro,
                    street_number: user.address?.numero,
                },
            };

            const payer = {
                entity_type: 'individual',
                type: 'customer',
                email: user.email,
                identification: {
                    type: 'CPF',
                    number: user.cpf,
                },
            };

            const additionalInfo = {
                items: carrinho.map((i) => {
                    return {
                        id: i.skuId,
                        title: i.name,
                        unit_price: i.value.promotionalPrice || i.value.price,
                        quantity: i.quantidade,
                    };
                }),
                payer: payerAddInfo,
                // payer: {email: 'cafecafe51@hotmail.com'},
                shipments: {
                    receiver_address: {
                        zip_code: user.address?.cep,
                        state_name: user.address?.uf,
                        city_name: user.address?.localidade,
                        street_name: user.address?.logradouro,
                        street_number: user.address?.numero,
                    },
                }, 
                
            };

            const response = await axios.post('/api/payment', {
                ...params.formData,
                date_of_expiration: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
                notification_url: process.env.NEXT_PUBLIC_URL_FOR_WEBHOOK,
                external_reference: user.id,
                payer: payer,
                additional_info: additionalInfo,
                // transaction_amount: 
                // statement_descriptor: 'statement_descriptor_test',
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            const paymentResponse: PaymentResponse = response.data;

            if(!paymentResponse.id) {
                throw new Error('Payment ID not found');
            }

            if (!paymentResponse.status) {
                throw new Error('Payment status not found');
            }
            
            if (!paymentResponse.payment_method_id) {
                throw new Error('Payment method not found');
            }

            if(paymentResponse.status === 'rejected') {
                // possíveis valores de status_detail: cc_rejected_call_for_authorize, cc_rejected_insufficient_amount, cc_rejected_bad_filled_security_code, cc_rejected_bad_filled_date, cc_rejected_bad_filled_other
                switch(paymentResponse.status_detail) {
                case 'cc_rejected_call_for_authorize':
                    setShowPaymentFailSection('Transação não autorizada pela operadora do cartão.');
                    break;
                case 'cc_rejected_insufficient_amount':
                    setShowPaymentFailSection('Valor do cartão não é suficiente.');
                    break;
                case 'cc_rejected_bad_filled_security_code':
                    setShowPaymentFailSection('Código de segurança do cartão inválido.');
                    break;
                case 'cc_rejected_bad_filled_date':
                    setShowPaymentFailSection('Data do cartão inválida.');
                    break;
                case 'cc_rejected_bad_filled_other':
                    setShowPaymentFailSection('Cartão inválido.');
                    break;
                default:
                    setShowPaymentFailSection('Transação não autorizada pela operadora do cartão.');
                    break;
                }
                setShowPaymentSection(false);
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
            try {
                await finishPayment(
                    orderStatus,
                    paymentId,
                    paymentResponse.payment_method_id,
                    totalAmount,
                    user,
                    state,
                    carrinho,
                    pixPaymentResponse,
                );
                router.push(`/pedido/${paymentId}`);
            } catch (error) {
                console.error('Erro ao finalizar o pagamento:', error);
                await cancelPayment(paymentId);
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
