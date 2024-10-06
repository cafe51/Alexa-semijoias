// app/api/create_preference/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { OrderType, UserType } from '@/app/utils/types';
import { nameGenerator } from '@/app/utils/nameGenerator';
// import { ProductType } from '@/app/utils/types';

// main = APP_USR-3347535765602982-091914-94de44dd70d353bb9b1eb275cb397e1f-609524119
// test = APP_USR-670073434032123-092021-3b0dce4f8daf263a2c71f2f5669ecd8b-1998711731

// Configure o Mercado Pago com seu token de acesso
const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MPAGOKEY! });
const preference = new Preference(client);

export async function GET(): Promise<NextResponse> {

    return NextResponse.json('create-preference');
}



export async function POST(req: NextRequest) {
    const body = await req.json();

    const cartItems = body.items as OrderType['cartSnapShot'];
    const user = body.userInfo as UserType;

    const preferenceData: PreferenceRequest = {
        items: cartItems.map((i) => {
            // console.log(i);
            return {
                id: i.skuId,
                title: i.name,
                unit_price: i.value.promotionalPrice || i.value.price,
                quantity: i.quantidade,
            };
        }),
        // auto_return: 'approved',
        payer: {
            name: nameGenerator(user.nome).firstName,
            surname: nameGenerator(user.nome).lastName,
            email: user.email,
            phone: {
                area_code: '92',
                number: '988065301',
            },
            address: {
                street_name: user.address?.logradouro,
                zip_code: user.address?.cep,
            },
        },
        statement_descriptor: 'ALEXAAAAAAAAAAAAAAAAAAAAAA',
        // payment_methods: {
        //     excluded_payment_types: [
        //         {
        //             id: 'atm',
        //         },
        //         {
        //             id: 'debitCard',
        //         },
        //         {
        //             id: 'mercadoPago',
        //         },
        //         {
        //             id: 'ticket',
        //         },
        //     ],
        //     installments: 6,
        // },
        // shipments: {
        //     cost: 30,
        //     mode: 'PAC',
        // },
        // back_urls: {
        //     failure: 'http://localhost:3000/failure',
        //     pending: 'http://localhost:3000/pending',
        //     success: 'http://localhost:3000/success',
        // },
        notification_url: process.env.NEXT_PUBLIC_URL_FOR_WEBHOOK,
        external_reference: 'external_reference_from_create-preference',

    };

    // console.log('preferenceData', preferenceData);

    try {
        const preferenceResponse = await preference.create({ body: preferenceData });
        // console.log('preferenceResponse', preferenceResponse);

        return NextResponse.json({ id: preferenceResponse.id });
    } catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error(error);
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}