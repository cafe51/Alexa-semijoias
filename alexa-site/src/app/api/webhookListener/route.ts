import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { OrderType, StatusType } from '@/app/utils/types';
import { consoleLogPaymentResponseData, consoleLogWebHookResponse } from '@/app/utils/consoleLogPaymentResponseData';

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const mpPayment = new Payment(client);

async function updateProductStock(productId: string, skuId: string, quantity: number, operation: '+' | '-') {
    const productRef = doc(projectFirestoreDataBase, 'products', productId);
    
    await runTransaction(projectFirestoreDataBase, async(transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
            throw new Error(`Product ${productId} not found`);
        }

        const productData = productDoc.data();
        const variationIndex = productData.productVariations.findIndex((v: any) => v.sku === skuId);
        
        if (variationIndex === -1) {
            throw new Error(`SKU ${skuId} not found in product ${productId}`);
        }

        const newStock = operation === '+' 
            ? productData.productVariations[variationIndex].estoque + quantity
            : productData.productVariations[variationIndex].estoque - quantity;

        if (newStock < 0) {
            throw new Error(`Insufficient stock for product ${productId}, SKU ${skuId}`);
        }

        productData.productVariations[variationIndex].estoque = newStock;
        productData.estoqueTotal = operation === '+'
            ? productData.estoqueTotal + quantity
            : productData.estoqueTotal - quantity;

        transaction.update(productRef, productData);
    });
}

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
            const orderData = orderSnap.data() as OrderType;

            let newStatus: StatusType;
            switch (paymentInfo.status) {
            case 'approved':
                newStatus = 'preparando para o envio';
                break;
            case 'cancelled':
            case 'rejected':
                newStatus = 'cancelado';
                // Return items to stock
                for (const item of orderData.cartSnapShot) {
                    await updateProductStock(item.productId, item.skuId, item.quantidade, '+');
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
}