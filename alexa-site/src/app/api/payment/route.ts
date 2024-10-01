import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.MPKEY! });
const payment = new Payment(client);

export async function POST(req: NextRequest) {
    const body = await req.json().then(data => data as { data: { id: string } });

    const res = await payment.get({ id: body.data.id });
    // exemplo de body:
    // body {
    //   action: 'payment.created',
    //   api_version: 'v1',
    //   data: { id: '1319695020' },
    //   date_created: '2024-09-24T20:26:38Z',
    //   id: 115998339055,
    //   live_mode: false,
    //   type: 'payment',
    //   user_id: '609524119'
    // }
    console.log('body', body);
    console.log('res', res);

    return Response.json({ success: true });
}