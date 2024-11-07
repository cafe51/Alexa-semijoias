import { formatPrice } from '../formatPrice';
import {  OrderType, UserType } from '../types';

export const emailConfirmationHtmlGenerator = (userData: UserType, orderId: string, orderData: OrderType, itemsList: string) => {
    const endereco = orderData.endereco;
    const enderecoFormatado = `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, ${endereco.cep}`;
    return (
        `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0 0 40px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Cabeçalho -->
              <div style="background-color: #F8C3D3; padding: 40px 20px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #333333; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">
                      !ALEXA SEMIJOIAS 🌸
                  </h1>
                  <p style="color: #C48B9F; margin: 10px 0 0 0; font-style: italic;">
                      Elegância em cada detalhe
                  </p>
              </div>
      
              <!-- Conteúdo Principal -->
              <div style="padding: 30px 40px; background-color: #ffffff;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">
                      Olá <span style="color: #C48B9F; font-weight: 500;">${userData.nome}</span>,
                  </p>
                  
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">
                      É com grande satisfação que confirmamos o recebimento do seu pedido. Cada peça será preparada com todo o cuidado que você merece.
                  </p>
      
                  <!-- Informações do Pedido -->
                  <div style="background-color: #FAF9F6; border-radius: 8px; padding: 25px; margin: 30px 0;">
                      <h3 style="color: #D4AF37; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                          Detalhes do Pedido
                      </h3>
                      <div style="margin-bottom: 15px;">
                          <p style="margin: 5px 0; color: #333333;"><strong style="color: #C48B9F;">Número do Pedido:</strong> ${orderId}</p>
                          <p style="margin: 5px 0; color: #333333;"><strong style="color: #C48B9F;">Status:</strong> ${orderData.status}</p>
                          <p style="margin: 5px 0; color: #333333;"><strong style="color: #C48B9F;">Forma de Pagamento:</strong> ${orderData.paymentOption}</p>
                          <p style="margin: 5px 0; color: #333333;"><strong style="color: #C48B9F;">Opção de Entrega:</strong> ${orderData.deliveryOption}</p>
                      </div>
                  </div>
      
                  <!-- Tabela de Itens -->
                  <h3 style="color: #D4AF37; margin: 30px 0 20px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                      Itens Selecionados
                  </h3>
                  <div style="overflow-x: auto;">
                      <table style="width: 100%; border-collapse: collapse;">
                          <thead>
                              <tr style="background-color: #F8C3D3;">
                                  <th style="padding: 15px; text-align: left; color: #333333; font-weight: 500;">Produto</th>
                                  <th style="padding: 15px; text-align: center; color: #333333; font-weight: 500;">Quantidade</th>
                                  <th style="padding: 15px; text-align: right; color: #333333; font-weight: 500;">Preço Unit.</th>
                                  <th style="padding: 15px; text-align: right; color: #333333; font-weight: 500;">Subtotal</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${itemsList}
                          </tbody>
                      </table>
                  </div>
      
                  <!-- Resumo do Pedido -->
                  <div style="background-color: #FAF9F6; border-radius: 8px; padding: 25px; margin: 30px 0;">
                      <h3 style="color: #D4AF37; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                          Resumo do Pedido
                      </h3>
                      <div style="border-top: 1px solid #F8C3D3; padding-top: 15px;">
                          <p style="display: flex; justify-content: space-between; margin: 5px 0; color: #333333;">
                              <span>Subtotal:</span>
                              <strong>${formatPrice(orderData.valor.soma)}</strong>
                          </p>
                          <p style="display: flex; justify-content: space-between; margin: 5px 0; color: #333333;">
                              <span>Frete:</span>
                              <strong>R$ ${formatPrice(orderData.valor.frete)}</strong>
                          </p>
                          <p style="display: flex; justify-content: space-between; margin: 15px 0 5px; padding-top: 15px; border-top: 2px solid #D4AF37; color: #333333;">
                              <span style="font-size: 18px; font-weight: 500;">Total:</span>
                              <strong style="font-size: 18px; color: #C48B9F;">R$ ${formatPrice(orderData.valor.total)}</strong>
                          </p>
                      </div>
                  </div>
      
                  <!-- Endereço de Entrega -->
                  <div style="background-color: #FAF9F6; border-radius: 8px; padding: 25px; margin: 30px 0;">
                      <h3 style="color: #D4AF37; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                          Endereço de Entrega
                      </h3>
                      <p style="color: #333333; margin: 5px 0; line-height: 1.6;">
                          ${enderecoFormatado}
                      </p>
                      ${endereco.referencia ? `<p style="color: #333333; margin: 10px 0 0 0;"><strong style="color: #C48B9F;">Referência:</strong> ${endereco.referencia}</p>` : ''}
                  </div>
      
                  <!-- Mensagem Final -->
                  <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #F8C3D3;">
                      <p style="color: #C48B9F; font-size: 18px; margin-bottom: 15px;">
                          Obrigado por escolher a Alexa Semijoias!
                      </p>
                      <p style="color: #333333; font-size: 14px; margin-bottom: 5px;">
                          Em caso de dúvidas, entre em contato conosco:
                      </p>
                      <p style="color: #D4AF37; font-size: 14px; margin-top: 0;">
                          alexasemijoias@alexasemijoias.com.br
                      </p>
                  </div>
              </div>
      
              <!-- Rodapé -->
              <div style="text-align: center; padding: 30px 20px; background-color: #F8C3D3; margin-top: 40px;">
                  <p style="color: #333333; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Alexa Semijoias. Todos os direitos reservados.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `
    );
};