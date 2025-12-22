// src/app/api/send_email_confirmation/route.ts


import { NextRequest, NextResponse } from 'next/server';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { Resend } from 'resend';
import { generateEmailMessage } from '@/app/utils/emailHandler/sendEmailFunctions';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: NextRequest) {
    try {
        const { orderData, userData }: { orderData: OrderType & FireBaseDocument, userData: UserType & FireBaseDocument } = await request.json();

        if (!orderData) {
            return NextResponse.json(
                { error: 'Dados do pedido não fornecidos' },
                { status: 400 },
            );
        }

        if (!userData) {
            return NextResponse.json(
                { error: 'Dados do usuário não fornecidos' },
                { status: 400 },
            );
        }

        const orderId = orderData.paymentId.toString();


        // console.log('*******************');
        // console.log('*******************');
        // console.log('*******************');
        // console.log(convertToDate(orderData.createdAt));
        // console.log('*******************');
        // console.log('*******************');
        // console.log('*******************');


        // Envia o e-mail de confirmação
        const message = generateEmailMessage('orderConfirmation', userData, orderId, orderData);

        if (!message) {
            return NextResponse.json(
                { error: 'Falha ao gerar mensagem de e-mail de confirmação' },
                { status: 500 },
            );
        }

        await resend.emails.send(message);

        const messageSaleForAdmin = {
            to: 'alexasemijoias@alexasemijoias.com',
            from: 'contato@alexasemijoias.com.br',
            subject: 'Venda Realizada ' + orderData.valor.soma,
            html: '<p>Olá Alexa Semijoias!</p><p>Sua venda foi realizada com sucesso.</p>',
        };


        await resend.emails.send(messageSaleForAdmin);


        return NextResponse.json({ message: 'E-mail de confirmação enviado' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao processar confirmação do pedido:', error);
        return NextResponse.json(
            { error: error },
            { status: 500 },
        );
    }
}
