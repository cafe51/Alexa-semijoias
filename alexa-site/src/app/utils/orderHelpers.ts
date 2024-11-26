// src/app/utils/orderHelpers.ts

import { OrderType, ProductCartType, StatusType, UserType, PixPaymentResponseType, AddressType, DeliveryOptionType, FireBaseDocument } from '../utils/types';
import { Timestamp } from 'firebase/firestore';
import { convertArrayToString } from './convertArrayToString';
import { nameGenerator } from './nameGenerator';

// Função para criar o objeto `newOrder`
export const createNewOrderObject = (
    orderStatus: StatusType,
    paymentId: string,
    selectedPaymentOption: string,
    installments: OrderType['installments'],
    totalAmount: number,
    user:  UserType & FireBaseDocument,
    carrinho: ProductCartType[],
    address: AddressType,
    deliveryOption: DeliveryOptionType | null,
    pixPaymentResponse?: PixPaymentResponseType,
): OrderType => {
    const deliveryPrice = deliveryOption?.price || 0;
    const totalQuantity = carrinho.reduce((acc, item) => acc + Number(item.quantidade), 0) || 0;

    return {
        endereco: address,
        cartSnapShot: carrinho,
        status: orderStatus,
        userId: user.id,
        valor: {
            frete: deliveryPrice || 0,
            soma: ((totalAmount || 0) - (deliveryPrice || 0)) || 0,
            total: totalAmount || 0,
        },
        totalQuantity,
        paymentOption: selectedPaymentOption,
        installments: installments,
        deliveryOption: deliveryOption ? deliveryOption : { name: '--', price: 0, deliveryTime: 0 },
        pixResponse: pixPaymentResponse || null,
        paymentId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };
};

// Função para criar o objeto `payerAddInfo`
export const createPayerAddInfo = (user: UserType & FireBaseDocument) => {
    return {
        first_name: nameGenerator(user.nome).firstName,
        last_name: nameGenerator(user.nome).lastName,
        phone: {
            area_code: user.phone ? user.phone[0] + user.phone[1] : '',
            number: user.phone ? user.phone.slice(2) : '',
        },
        address: {
            zip_code: user.address?.cep,
            street_name: user.address?.logradouro,
            street_number: user.address?.numero,
        },
    };
};

// Função para criar o objeto `payer`
export const createPayer = (user: UserType & FireBaseDocument) => {
    return {
        entity_type: 'individual',
        type: 'customer',
        email: user.email,
        identification: {
            type: 'CPF',
            number: user.cpf,
        },
    };
};

// Função para criar o objeto `additionalInfo`
export const createAdditionalInfo = (
    carrinho: ProductCartType[],
    payerAddInfo: ReturnType<typeof createPayerAddInfo>,
    user: UserType & FireBaseDocument,
) => {
    return {
        items: carrinho.map((item) => ({
            id: item.skuId,
            title: item.name,
            description: `${item.name} ${convertArrayToString(item.categories)}`,
            unit_price: item.value.promotionalPrice || item.value.price,
            quantity: item.quantidade,
        })),
        payer: payerAddInfo,
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
};
