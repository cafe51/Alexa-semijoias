import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type';
import { FireBaseDocument, UseCheckoutStateType, UserType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';

interface PaymentBrickProps {
  totalAmount: number;
  user: UserType & FireBaseDocument;
  state: UseCheckoutStateType;
}

export default function PaymentBrick({ totalAmount, user, state }: PaymentBrickProps) {
    const { carrinho } = useUserInfo();

    // Inicializa o Mercado Pago
    initMercadoPago(process.env.NEXT_PUBLIC_MPAGOPUBLICKEY!, {
        locale: 'pt-BR',
    });

    // Usa o hook personalizado
    const { onSubmit, onError, onReady } = usePaymentProcessing();

    const customization: IPaymentBrickCustomization = {
        paymentMethods: {
            bankTransfer: 'all',
            creditCard: 'all',
            maxInstallments: 6,
        },
    };

    return (
        <Payment
            initialization={ {
                amount: Number(totalAmount),
                payer: {
                    email: user.email,
                    firstName: user.nome.split(' ')[0],
                    lastName: user.nome.split(' ')[1],
                    address: {
                        city: user.address?.localidade,
                        additionalInformation: user.address?.referencia,
                        complement: user.address?.complemento,
                        federalUnit: user.address?.uf,
                        neighborhood: user.address?.bairro,
                        streetName: user.address?.logradouro,
                        zipCode: user.address?.cep,
                    },
                },
            } }
            customization={ customization }
            onSubmit={ (params) => onSubmit(params, totalAmount, user, state, carrinho || []) }
            onReady={ onReady }
            onError={ onError }
        />
    );
}
