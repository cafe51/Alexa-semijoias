import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';

export function consoleLogWebHookResponse(body: any) {
    console.log('*******************************');
    console.log('                               ');
    console.log('                               ');
    console.log('                               ');

    console.log('Received webhook:', body);
    console.log('                               ');
    console.log('*******************************');
    console.log('                               ');
    console.log('                               ');
}

export function consoleLogPaymentResponseData(paymentInfo: PaymentResponse) {
    const newPaymentInfo: PaymentResponse = {
        api_response: {
            headers: ['headers', ['headers']],
            status: paymentInfo.api_response?.status,
        },
        id: paymentInfo.id,
        shipping_amount: paymentInfo.shipping_amount,
        statement_descriptor: paymentInfo.statement_descriptor,
        status: paymentInfo.status,
        transaction_amount: paymentInfo.transaction_amount,
        installments: paymentInfo.installments,
        date_created: paymentInfo.date_created,
        date_last_updated: paymentInfo.date_last_updated,
        date_of_expiration: paymentInfo.date_of_expiration,
        transaction_details: {
            installment_amount: paymentInfo.transaction_details?.installment_amount,
            overpaid_amount: paymentInfo.transaction_details?.overpaid_amount,
            total_paid_amount: paymentInfo.transaction_details?.overpaid_amount,
        },
        payment_method_id: paymentInfo.payment_method_id,
        payment_type_id: paymentInfo.payment_type_id,
        additional_info: {
            items: paymentInfo.additional_info?.items,
            shipments: {
                receiver_address: {
                    apartment: paymentInfo.additional_info?.shipments?.receiver_address?.apartment,
                    city_name: paymentInfo.additional_info?.shipments?.receiver_address?.city_name,
                    floor: paymentInfo.additional_info?.shipments?.receiver_address?.floor,
                    state_name: paymentInfo.additional_info?.shipments?.receiver_address?.state_name,
                },
            },
            payer: {
                address: paymentInfo.additional_info?.payer?.address,
                first_name: paymentInfo.additional_info?.payer?.first_name,
                last_name: paymentInfo.additional_info?.payer?.last_name,
                phone: {
                    area_code: paymentInfo.additional_info?.payer?.phone?.area_code,
                    number: paymentInfo.additional_info?.payer?.phone?.number,
                    extension: paymentInfo.additional_info?.payer?.phone?.extension,
                },
            },
        },
        payer: {
            identification: { number: paymentInfo.payer?.identification?.number, type: paymentInfo.payer?.identification?.type },
            entity_type: paymentInfo.payer?.entity_type,
            phone: { number: paymentInfo.payer?.phone?.number, extension: paymentInfo.payer?.phone?.extension, area_code: paymentInfo.payer?.phone?.area_code },
            last_name: paymentInfo.payer?.last_name,
            id: paymentInfo.payer?.id,
            type: paymentInfo.payer?.type,
            first_name: paymentInfo.payer?.first_name,
            email: paymentInfo.payer?.email,
            address: {
                street_name: paymentInfo.payer?.address?.street_name,
                street_number: paymentInfo.payer?.address?.street_number,
                zip_code: paymentInfo.payer?.address?.zip_code,
            },
            
        },
        notification_url: paymentInfo.notification_url,
        operation_type: paymentInfo.operation_type,
        point_of_interaction: {
            transaction_data: {
                qr_code: paymentInfo.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: paymentInfo.point_of_interaction?.transaction_data?.qr_code_base64,
                ticket_url: paymentInfo.point_of_interaction?.transaction_data?.ticket_url,
            },
        },
        external_reference: paymentInfo.external_reference,
    };

    console.log('*******************************');
    console.log('                               ');
    console.log('                               ');
    console.log('                               ');
    console.log('Payment info:', newPaymentInfo);
    console.log('                               ');
    console.log('*******************************');
    console.log('                               ');
    console.log('                               ');
}