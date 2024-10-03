//src/app/api/cancel_payment/[paymentId]/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const payment = new Payment(client);

export async function PUT(
    req: NextRequest,
    { params }: { params: { paymentId: string } },
) {
    try {
        const { paymentId } = params;
        const body = await req.json();

        if (body.status !== 'cancelled') {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const response = await payment.cancel({ id: paymentId });

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error cancelling payment:', error);
        return NextResponse.json({ error: 'Failed to cancel payment' }, { status: 500 });
    }
}