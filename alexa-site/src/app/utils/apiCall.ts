// src/app/utils/apiCall.ts
import { IPaymentFormData } from '@mercadopago/sdk-react/bricks/payment/type';
import axios from 'axios';
import { FireBaseDocument, UserType } from './types';

type PayerType = {
    entity_type: string;
    type: string;
    email: string;
    identification: {
        type: string;
        number: string;
    };
}

type PayerAddInfoType = {
    first_name: string;
    last_name: string;
    phone: {
        area_code: string;
        number: string;
    },
    address: {
        zip_code?: string | undefined;
        street_name?: string | undefined;
        street_number?: string | undefined;
    },
};

type AdditionalInfoType = {
    items: {
        id: string,
        title: string,
        description: string,
        unit_price: number,
        quantity: number,
    }[];
    payer: PayerAddInfoType;
    shipments: {
        receiver_address: {
            zip_code?: string;
            state_name?: string;
            city_name?: string;
            street_name?: string;
            street_number?: string;
        };
    };

};

export const cancelPayment = async(paymentId: string) => {
    try {
        const response = await axios.put(
            `/api/cancel_payment/${paymentId}`,
            { status: 'cancelled' },
            { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 200) {
            console.log('Pagamento cancelado com sucesso:', response.data.id);
        } else {
            console.log('STATUS DA CHAMADA DE CANCELAMENTO DE PAGAMENTO:', response.status);
            console.error('Falha ao cancelar o pagamento:', response.data.id);
            throw new Error('Falha ao cancelar o pagamento');
        }
    } catch (error) {
        console.error('Erro ao cancelar o pagamento:', error);
        throw error;
    }
};

export const sendEmailConfirmation = async(paymentId: string) => {
    try {
        const response = await axios.post(
            '/api/send_email_confirmation/',
            { paymentId: paymentId }, 
            { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 200) {
            console.log('Email enviado com sucesso:', paymentId);
        } else {
            console.log('STATUS DA CHAMADA DE ENVIO DE EMAIL:', response.status);
            console.error('Falha ao enviar o email:', paymentId);
            throw new Error('Falha ao enviar o email');
        }
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
        throw error;
    }
};

export const createPayment = async(params: IPaymentFormData, user: UserType & FireBaseDocument, payer: PayerType, additionalInfo: AdditionalInfoType) => {
    try {
        const response = await axios.post(
            '/api/payment',
            { 
                ...params.formData,
                date_of_expiration: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
                notification_url: process.env.NEXT_PUBLIC_URL_FOR_WEBHOOK,
                external_reference: user.id,
                payer: payer,
                additional_info: additionalInfo,
            }, 
            { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 201) {
            console.log('Pagamento criado com sucesso:', response.data.id);
        } else {
            console.log('STATUS DA CHAMADA DE CRIAÇÃO DE PAGAMENTO:', response.status);
            console.log('RESPONSE:', response);

            console.error('Falha ao criar o pagamento:', response.data.id);
            throw new Error('Falha ao criar o pagamento');
        }

        return response;
    } catch (error) {
        console.error('Erro ao criar o pagamento:', error);
        throw error;
    }
};

export const sendEmailApprovedPayment = async(paymentId: string) => {
    try {
        const response = await axios.post(
            '/api/send_email_approved_payment/',
            { paymentId: paymentId }, 
            { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 200) {
            console.log('Email enviado com sucesso:', paymentId);
        } else {
            console.log('STATUS DA CHAMADA DE ENVIO DE EMAIL:', response.status);
            console.error('Falha ao enviar o email:', paymentId);
            throw new Error('Falha ao enviar o email');
        }
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
        throw error;
    }
};

export const sendEmailOrderSent = async(paymentId: string) => {
    try {
        const response = await axios.post(
            '/api/send_email_order_sent/',
            { paymentId: paymentId }, 
            { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 200) {
            console.log('Email enviado com sucesso:', paymentId);
        } else {
            console.log('STATUS DA CHAMADA DE ENVIO DE EMAIL:', response.status);
            console.error('Falha ao enviar o email:', paymentId);
            throw new Error('Falha ao enviar o email');
        }
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
        throw error;
    }
};