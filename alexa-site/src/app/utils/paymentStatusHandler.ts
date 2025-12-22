// src/app/utils/paymentStatusHandler.ts

export const handlePaymentFailure = (
    statusDetail: string | undefined,
    setShowPaymentFailSection: (message: string) => void,
    setShowPaymentSection: (showPaymentSection: boolean) => void,
) => {
    switch (statusDetail) {
        case 'bank_error':
            setShowPaymentFailSection('Pagamento rejeitado devido a um erro com o banco.');
            break;
        case 'cc_rejected_3ds_mandatory':
            setShowPaymentFailSection('Pagamento rejeitado por não ter challenge 3DS obrigatório.');
            break;
        case 'cc_rejected_bad_filled_card_number':
            setShowPaymentFailSection('Número do cartão incorreto.');
            break;
        case 'cc_rejected_bad_filled_date':
            setShowPaymentFailSection('Data de validade incorreta.');
            break;
        case 'cc_rejected_bad_filled_other':
            setShowPaymentFailSection('Detalhes do cartão incorretos.');
            break;
        case 'cc_rejected_bad_filled_security_code':
            setShowPaymentFailSection('Código de segurança (CVV) incorreto.');
            break;
        case 'cc_rejected_blacklist':
            setShowPaymentFailSection('O cartão está desativado devido a problemas de roubo/fraude.');
            break;
        case 'cc_rejected_call_for_authorize':
            setShowPaymentFailSection('Transação precisa de autorização prévia com a operadora.');
            break;
        case 'cc_rejected_card_disabled':
            setShowPaymentFailSection('Cartão desativado.');
            break;
        case 'cc_rejected_duplicated_payment':
            setShowPaymentFailSection('Transação recusada por pagamento duplicado.');
            break;
        case 'cc_rejected_high_risk':
            setShowPaymentFailSection('Transação rejeitada por alto risco de fraude.');
            break;
        case 'cc_rejected_insufficient_amount':
            setShowPaymentFailSection('Saldo insuficiente no cartão.');
            break;
        case 'cc_rejected_invalid_installments':
            setShowPaymentFailSection('Número de parcelas inválido.');
            break;
        case 'cc_rejected_max_attempts':
            setShowPaymentFailSection('Número máximo de tentativas excedido.');
            break;
        case 'cc_rejected_time_out':
            setShowPaymentFailSection('Tempo limite excedido na transação.');
            break;
        case 'cc_amount_rate_limit_exceeded':
            setShowPaymentFailSection('Superou o limite permitido pelo meio de pagamento.');
            break;
        case 'rejected_high_risk':
            setShowPaymentFailSection('Rejeitado por avaliação de risco e crédito.');
            break;
        case 'rejected_insufficient_data':
            setShowPaymentFailSection('Rejeitado por falta de informações obrigatórias.');
            break;
        case 'rejected_by_bank':
            setShowPaymentFailSection('Operação rejeitada pelo banco.');
            break;
        case 'rejected_by_regulations':
            setShowPaymentFailSection('Pagamento rejeitado devido a regulamentações.');
            break;
        default:
            setShowPaymentFailSection('Transação não autorizada pela operadora do cartão.');
            break;
    }

    setShowPaymentSection(false);
};
