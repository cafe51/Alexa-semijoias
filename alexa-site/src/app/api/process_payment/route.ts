import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.MPKEY! });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await payment.create({ body: {
            ...body,
            notification_url: 'https://webhook.site/21ff4d05-a4c6-454e-b58b-2a6c179cd8a3',
            statement_descriptor: 'AALEXAAAAA',
            date_of_expiration: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
        } });
        return NextResponse.json(response, { status: 201 });
    } catch (error) { 
        return NextResponse.json({ error: error }, { status: 500 });
    }

}