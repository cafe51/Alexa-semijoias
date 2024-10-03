// src/app/api/process_payment/route.ts

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await payment.create({ body: {
            ...body,
            notification_url: process.env.NEXT_PUBLIC_URL_FOR_WEBHOOK,
            statement_descriptor: 'AALEXAAAAA',
            date_of_expiration: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
        } });
        return NextResponse.json(response, { status: 201 });
    } catch (error) { 
        return NextResponse.json({ error: error }, { status: 500 });
    }

}