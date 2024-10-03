Abaixo segue uma parte da documentação do mercado pago:

## Criar cancelamento

### PUT

`https://api.mercadopago.com/v1/payments/{payment_id}`

Este endpoint permite cancelar uma compra para um pagamento específico, desde que o status do pagamento seja `in_process`, `pending` ou `authorized`. Em caso de sucesso, a requisição retornará um código de status 200.

### Produtos relacionados

---

### Parâmetros de requisição

#### PATH

| Parâmetro  | Tipo   | Obrigatório | Descrição                                 |
|------------|--------|-------------|-------------------------------------------|
| payment_id | string | Sim         | Número de identificação (ID) de pagamento.|

#### BODY

| Parâmetro  | Tipo   | Obrigatório | Descrição                                                                  |
|------------|--------|-------------|------------------------------------------------------------------------------|
| status     | string | Sim         | Status do Pagamento - Este campo aceita exclusivamente o status `cancelled`. |

---

### Parâmetros de resposta

| Parâmetro               | Tipo   | Descrição                                                                                   |
|-------------------------|--------|---------------------------------------------------------------------------------------------|
| id                      | number | Identificador de pagamento.                                                                 |
| date_created            | string | Data de criação do cancelamento.                                                            |
| date_approved           | string | Data de aprovação do cancelamento.                                                          |
| date_last_updated       | string | Data da última atualização.                                                                 |
| date_of_expiration      | string | Data de validade.                                                                           |
| money_release_date      | string | Data de liberação do dinheiro.                                                              |
| operation_type          | string | Tipo de operação.                                                                           |
| issuer_id               | number | Identificador do emissor.                                                                   |
| payment_method_id       | string | Identificador do meio de pagamento.                                                         |
| payment_type_id         | string | Identificador do tipo de pagamento.                                                         |
| status                  | string | Status do cancelamento.                                                                     |
| status_detail           | string | Detalhe do status. Este campo trará o detalhe do motivo do cancelamento do pagamento.       |
| currency_id             | string | Identificador de moeda.                                                                     |
| description             | string | Descrição do produto/serviço cancelado.                                                     |
| live_mode               | string | Indica se o estorno será processado em modo sandbox ou produção (`TRUE` para produção).      |
| sponsor_id              | string | Identificador do patrocinador.                                                              |
| authorization_code      | string | Código de autorização.                                                                     |
| money_release_schema    | string | Esquema de liberação de dinheiro.                                                           |
| taxes_amount            | number | Valor de imposto.                                                                           |
| counter_currency        | string | Contador de moeda.                                                                          |
| brand_id                | string | Identificador de marca.                                                                     |
| shipping_amount         | number | Valor de envio.                                                                             |
| pos_id                  | string | Identificador de POS.                                                                       |
| store_id                | string | Identificador da loja.                                                                      |
| integrator_id           | string | Identificador do integrador.                                                                |
| platform_id             | string | Identificador da plataforma.                                                                |
| corporation_id          | string | Identificador da corporação.                                                                |
| collector_id            | number | Número identificador do collector.                                                          |
| payers                  | array  | Lista de pagadores.                                                                         |
| marketplace_owner       | string | Proprietário do marketplace.                                                                |
| metadata                | array  | Contém metadados de pagamento enviados no post de payment.                                  |
| additional_info         | array  | Lista de informações adicionais.                                                            |
| order                   | array  | Lista de pedidos.                                                                           |
| external_reference      | string | Referência externa.                                                                         |
| transaction_amount      | number | Valor da transação.                                                                         |
| transaction_amount_refunded | number | Valor reembolsado da transação.                                                            |
| coupon_amount           | number | Valor do cupom.                                                                             |
| differential_pricing_id | string | Identificador do diferencial de preço.                                                      |
| deduction_schema        | string | Esquema de dedução.                                                                         |
| barcode                 | array  | Lista de códigos de barra.                                                                  |
| installments            | number | Número de parcelas.                                                                         |
| transaction_details     | array  | Lista de detalhes da transação.                                                             |
| fee_details             | array  | Lista de detalhes das taxas.                                                                |
| charges_details         | array  | Lista de detalhes da cobrança.                                                              |
| captured                | boolean | Captura habilitada.                                                                         |
| binary_mode             | boolean | Modo binário habilitado.                                                                    |
| call_for_authorize_id   | string | Chamada para autorizar identificador.                                                       |
| statement_descriptor    | string | Descritor de extrato bancário.                                                              |
| card                    | array  | Lista de cartões.                                                                           |
| notification_url        | string | URL de notificação.                                                                         |
| refunds                 | array  | Lista de reembolsos.                                                                        |
| processing_mode         | string | Modo de processamento.                                                                      |
| merchant_account_id     | string | Identificador da conta do merchant.                                                         |
| merchant_number         | string | Número do merchant.                                                                         |
| acquirer_reconciliation | array  | Lista de reconciliação do adquirente.                                                       |
| point_of_interaction    | array  | Lista de ponto de interação.                                                                |

#### Atributos de `point_of_interaction`

| Parâmetro   | Tipo   | Descrição                   |
|-------------|--------|-----------------------------|
| type        | string | Tipo.                       |
| business_info | array  | Lista de informações de negócio. |

#### Subatributos de `business_info`

| Parâmetro | Tipo   | Descrição |
|-----------|--------|-----------|
| unit      | string | Unidade.  |
| sub_unit  | string | Subunidade.|

---

### Erros

- **400**: Erro de requisição.
- **401**: Erro de autorização.
- **403**: Acesso proibido.
- **404**: Recurso não encontrado.

Requisição:
```
import MercadoPago, { Payment } from 'mercadopago';

const client = new MercadoPago({ accessToken: 'TEST-703********22370-01********2405a0c3********7232f7a5********0082888' });

  const payment = new Payment(client);
  payment.cancel({
      id: '18552260055'
 }).then(console.log).catch(console.log);

```

Resposta de exemplo:

```
{
  "id": 18746874919,
  "date_created": "2021-12-10T17:13:23.000-04:00",
  "date_approved": null,
  "date_last_updated": "2021-12-10T17:31:34.000-04:00",
  "date_of_expiration": "2021-12-13T22:59:59.000-04:00",
  "money_release_date": null,
  "operation_type": "regular_payment",
  "issuer_id": null,
  "payment_method_id": "bolbradesco",
  "payment_type_id": "ticket",
  "status": "cancelled",
  "status_detail": "by_collector",
  "currency_id": "BRL",
  "description": "Meu produto",
  "live_mode": null,
  "sponsor_id": null,
  "authorization_code": null,
  "money_release_schema": null,
  "taxes_amount": 0,
  "counter_currency": null,
  "brand_id": null,
  "shipping_amount": 0,
  "pos_id": null,
  "store_id": null,
  "integrator_id": null,
  "platform_id": null,
  "corporation_id": null,
  "collector_id": null,
  "payers": [
    {
      "first_name": null,
      "last_name": null,
      "email": "test_user_80507629@testuser.com",
      "type": "collector",
      "identification": [
        {
          "number": "32659430",
          "type": "DNI"
        }
      ],
      "phone": [
        {
          "area_code": null,
          "number": null,
          "extension": null
        }
      ],
      "entity_type": null,
      "id": "1003743392",
      "operator_id": null
    }
  ],
  "marketplace_owner": null,
  "metadata": [
    {}
  ],
  "additional_info": [
    {
      "items": [
        {
          "id": "234",
          "title": {
            "en": "My product",
            "pt": "Meu produto",
            "es": "Mi producto"
          },
          "description": {
            "en": "E-commerce store cellphone",
            "pt": "Celular da loja online",
            "es": "Celular de la tienda online"
          },
          "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
          "category_id": "art",
          "quantity": "1",
          "unit_price": "75.76"
        }
      ]
    }
  ],
  "order": [
    {
      "type": "mercadopago",
      "id": "3754501423"
    }
  ],
  "external_reference": "firstname@gmail.com",
  "transaction_amount": 75.76,
  "transaction_amount_refunded": 0,
  "coupon_amount": 0,
  "differential_pricing_id": null,
  "deduction_schema": null,
  "barcode": [
    {
      "content": "23791883300000075763380250600221946300633330"
    }
  ],
  "installments": 1,
  "transaction_details": [
    {
      "payment_method_reference_id": "6002219463",
      "verification_code": "6002219463",
      "net_received_amount": 0,
      "total_paid_amount": 75.76,
      "overpaid_amount": 0,
      "external_resource_url": "https://www.mercadopago.com/mlb/payments/beta/ticket/helper?payment_id=18746874919&payment_method_reference_id=6002219463&caller_id=1003743392&hash=6a8c570f-9c39-4a5c-9b55-85ae1b724bf",
      "installment_amount": 0,
      "financial_institution": null,
      "payable_deferral_period": null,
      "acquirer_reference": null
    }
  ],
  "fee_details": [
    {}
  ],
  "charges_details": [
    {}
  ],
  "captured": true,
  "binary_mode": true,
  "call_for_authorize_id": null,
  "statement_descriptor": null,
  "card": [
    {}
  ],
  "notification_url": "https://webhook.site/17a3a5ce-28d4-4b4f-ba3f-a7595c17c6d8",
  "refunds": [
    {}
  ],
  "processing_mode": "aggregator",
  "merchant_account_id": null,
  "merchant_number": null,
  "acquirer_reconciliation": [
    {}
  ],
  "point_of_interaction": [
    {
      "type": "Unspecified",
      "business_info": [
        {
          "unit": "online_payments",
          "sub_unit": "checkout_pro"
        }
      ]
    }
  ]
}
```