import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { OrderType, UserType } from '@/app/utils/types';
import sendgrid from '@sendgrid/mail';
import { sendOrderApprovedPaymentEmail } from '@/app/utils/emailHandler/sendOrderApprovedPaymentEmail';

async function getDocumentById<T>(collection: string, id: string) {
    const docRef = doc(projectFirestoreDataBase, collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return NextResponse.json(
            { error: `Dados de ${collection} não encontrados ao tentar enviar email de confirmação de pagamento aprovado` },
            { status: 404 },
        );
    }
    return docSnap.data() as T;
}

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);

export async function POST(request: NextRequest) {
    try {
        const { paymentId } = await request.json();

        if (!paymentId) {
            return NextResponse.json(
                { error: 'Dados do pedido não fornecidos' },
                { status: 400 },
            );
        }

        const orderId = paymentId.toString();

        const orderData = await getDocumentById<OrderType>('pedidos', orderId);
        if(orderData instanceof NextResponse) return orderData;

        const userData = await getDocumentById<UserType>('usuarios', orderData.userId);
        if(userData instanceof NextResponse) return userData;

        // Envia o e-mail de confirmação de pagamento aprovado
        const message = sendOrderApprovedPaymentEmail(userData, orderId, orderData);

        if(!message) {
            return NextResponse.json(
                { error: 'Falha ao gerar mensagem de e-mail de confirmação de pagamento aprovado' },
                { status: 500 },
            );
        }
        
        await sendgrid.send(message);

        return NextResponse.json({  message: 'E-mail de confirmação de pagamento aprovado enviado' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao processar confirmação de pagamento aprovado:', error);
        return NextResponse.json(
            { error: error },
            { status: 500 },
        );
    }
}