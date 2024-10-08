// src/app/api/payment/route.ts

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const response = await payment.create({ body: {
            ...body,
            statement_descriptor: 'ALEXA SEMI JOIAS',
        } });
          
        return NextResponse.json(response, { status: 201 });
    } catch (error) { 
        return NextResponse.json({ error: error }, { status: 500 });
    }

}