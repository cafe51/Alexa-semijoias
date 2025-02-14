// src/app/api/webhookListener/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { FireBaseDocument, OrderType, StatusType, UserType } from '@/app/utils/types';
import { consoleLogPaymentResponseData, consoleLogWebHookResponse } from '@/app/utils/consoleLogPaymentResponseData';
import sendgrid from '@sendgrid/mail';
import { generateEmailMessage } from '@/app/utils/emailHandler/sendEmailFunctions';
import { deleteCouponUsageDoc, updateCuponsDocStock, updateProductStock } from './firestoreUpdateFuncionts';
import { consoleLogEmailEnviado, consoleLogPreparandoEnvio } from './consolelogs';

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const mpPayment = new Payment(client);

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        consoleLogWebHookResponse(body);


        if (body.type !== 'payment') {
            return NextResponse.json({ message: 'Ignored non-payment webhook' }, { status: 200 });
        }

        const paymentId = body.data.id;
        const paymentInfo = await mpPayment.get({ id: paymentId });
        consoleLogPaymentResponseData(paymentInfo);

        const orderId = paymentId.toString();

        const orderRef = doc(projectFirestoreDataBase, 'pedidos', orderId);

        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
            const orderData = orderSnap.data() as OrderType & FireBaseDocument;
            const userRef = doc(projectFirestoreDataBase, 'usuarios', orderData.userId);
            const userSnap = await getDoc(userRef);
            if(userSnap.exists()) {
                const userData = userSnap.data() as UserType & FireBaseDocument;
                const cancelMessageEmail = generateEmailMessage('orderCancellation', userData, orderId, orderData);
                const approvedMessageEmail = generateEmailMessage('paymentConfirmation', userData, orderId, orderData);

                let newStatus: StatusType;
                switch (paymentInfo.status) {
                case 'approved':
                    newStatus = 'preparando para o envio';
                    consoleLogPreparandoEnvio(orderData);

                    if (approvedMessageEmail && orderData.status !== 'entregue' && orderData.status !== 'cancelado') {
                        consoleLogEmailEnviado();
                        await sendgrid.send(approvedMessageEmail);
                    }
                    break;
                case 'cancelled':
                case 'rejected':
                    newStatus = 'cancelado';
                    // Return items to stock
                    for (const item of orderData.cartSnapShot) {
                        await updateProductStock(item.productId, item.skuId, item.quantidade, '+');
                    }
                    if(orderData.couponId && orderData.couponId.length > 0) {
                        await updateCuponsDocStock(orderData.couponId, '+');
                        await deleteCouponUsageDoc(orderData.id);
                    }
                
                    if (cancelMessageEmail && orderData.status !== 'entregue' && orderData.status !== 'cancelado') {
                        await sendgrid.send(cancelMessageEmail);
                    }
                    break;
                default:
                    newStatus = 'aguardando pagamento';
                }
                await updateDoc(orderRef, { 
                    status: newStatus,
                    updatedAt: new Date(),
                });
        
                console.log(`Updated order ${orderId} status to ${newStatus}`);
            }

        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
}