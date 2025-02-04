import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type';
import { FireBaseDocument, UseCheckoutStateType, UserType } from '../../../app/utils/types';
import { useUserInfo } from '../../../app/hooks/useUserInfo';
import { usePaymentProcessing } from '../../../app/hooks/usePaymentProcessing';
import { useEffect } from 'react';
import { nameGenerator } from '../../../app/utils/nameGenerator';
import { convertArrayToString } from '../../../app/utils/convertArrayToString';
import { trackPixelEvent } from '@/app/utils/metaPixel';

interface PaymentBrickProps {
    totalAmount: number;
    user: UserType & FireBaseDocument;
    state: UseCheckoutStateType;
    preferenceId: string;
    setShowPaymentFailSection: (showPaymentFailSection: boolean | string) => void;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
    setIsProcessingPayment: (isProcessing: boolean) => void;
    setIsPaymentFinished: (isPaymentFinished: boolean) => void;
    setLoadingPayment: (isPaymentLoading: boolean) => void;
}

export default function PaymentBrick({ 
    totalAmount, 
    user, 
    state, 
    preferenceId, 
    setShowPaymentFailSection, 
    setShowPaymentSection,
    setIsProcessingPayment,
    setIsPaymentFinished,
    setLoadingPayment,
}: PaymentBrickProps) {
    const { carrinho } = useUserInfo();

    useEffect(() => {
        console.log('preference id passado para o payment brick', preferenceId);
    }, [preferenceId]);

    // Inicializa o Mercado Pago
    initMercadoPago(process.env.NEXT_PUBLIC_MPAGOPUBLICKEY!, {
        locale: 'pt-BR',
    });

    // Usa o hook personalizado
    const { onSubmit, onError, onReady } = usePaymentProcessing(setIsPaymentFinished);

    const customization: IPaymentBrickCustomization = {
        paymentMethods: {
            bankTransfer: 'all',
            creditCard: 'all',
            maxInstallments: 6,
        },
        visual: {
            style: {
                customVariables: {
                    baseColor: '#D4AF37',
                    fontSizeLarge: '1.125rem',
                    successColor: '#D4AF37',
                },
            },
        },
    };

    return (
        <Payment
            initialization={ {
                preferenceId: preferenceId,
                amount: Number(totalAmount),
                items: {
                    itemsList: carrinho ? carrinho.map((i) => {
                        return {
                            // id: i.skuId,
                            // title: i.name,
                            // unit_price: i.value.promotionalPrice || i.value.price,
                            // quantity: i.quantidade,
                            name: i.name,
                            units: i.quantidade,
                            value: i.value.promotionalPrice || i.value.price,
                            description: i.name + ' ' + convertArrayToString(i.categories),
                        };
                    }) : [{
                        name: '',
                        units: 0,
                        value: 0,
                    }],
                    totalItemsAmount: Number(totalAmount),
                },
                shipping: { // opcional
                    costs: 5, // opcional
                    shippingMode: state.deliveryOption?.name ? state.deliveryOption?.name : 'not_specified', // opcional
                    // description: "<SHIPPING_DESCRIPTION>", // opcional
                    receiverAddress: {
                        streetName: user.address?.logradouro ? user.address?.logradouro : '',
                        streetNumber: user.address?.numero ? user.address?.numero : '',
                        //   complement: "<COMPLEMENT>",
                        neighborhood: user.address?.bairro ? user.address?.bairro : '',
                        city: user.address?.localidade ? user.address?.localidade : '',
                        federalUnit: user.address?.uf ? user.address?.uf : '',
                        zipCode: user.address?.cep ? user.address?.cep : '',
                        additionalInformation: user.address?.referencia ? user.address?.referencia : '',
                    },
                },
                payer: {
                    firstName: nameGenerator(user.nome).firstName,
                    lastName: nameGenerator(user.nome).lastName,
                    entityType: 'individual',
                    email: user.email,
                    identification: {
                        type: 'CPF',
                        number: user.cpf.replace(/\D/g, ''),
                    },
                    address: {
                        additionalInformation: user.address?.referencia,
                        city: user.address?.localidade,
                        complement: user.address?.complemento,
                        federalUnit: user.address?.uf,
                        neighborhood: user.address?.bairro,
                        streetName: user.address?.logradouro,
                        zipCode: user.address?.cep,
                        streetNumber: user.address?.numero,
                    },
                },
            } }
            customization={ customization }
            onSubmit={ async(params) => {
                setIsProcessingPayment(true);
                setLoadingPayment(true);
                // Meta Pixel
                trackPixelEvent('Purchase', {
                    currency: 'BRL',
                    value: totalAmount,
                    content_type: 'product',
                    contents: carrinho?.map(item => ({
                        id: item.skuId,
                        quantity: item.quantidade,
                    })),
                    content_ids: carrinho?.map(item => item.skuId),
                    num_items: carrinho?.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0),
                });
                return onSubmit(params, totalAmount, user, state, carrinho || [], setShowPaymentFailSection, setShowPaymentSection, setLoadingPayment);
            } }
            onReady={ onReady }
            onError={ onError }
        />
    );
}
