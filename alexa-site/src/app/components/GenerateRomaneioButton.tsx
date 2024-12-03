'use client';

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { StandardFonts } from 'pdf-lib';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { DadosDaEmpresaType } from '@/app/utils/types';

interface GenerateRomaneioButtonProps {
    order: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
    dadosDaEmpresa: DadosDaEmpresaType;
}

const GenerateRomaneioButton: React.FC<GenerateRomaneioButtonProps> = ({ order, user, dadosDaEmpresa }) => {
    const generatePDF = async() => {
        const pdfDoc = await PDFDocument.create();

        pdfDoc.registerFontkit(fontkit);

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        const page = pdfDoc.addPage([595, 842]); // Tamanho A4
        const { width, height } = page.getSize();
        const margin = 50;
        let cursorY = height - margin;

        const drawText = (text: string, x: number, y: number, font = timesRomanFont, size = 12) => {
            page.drawText(text, { x, y, size, font });
        };

        const drawLine = (y: number, thickness: number = 1) => {
            page.drawLine({
                start: { x: margin, y },
                end: { x: width - margin, y },
                thickness,
                color: rgb(0, 0, 0),
            });
        };

        // Cabeçalho do romaneio
        drawText(dadosDaEmpresa.nome, margin, cursorY, timesRomanFontBold, 16);
        cursorY -= 20;
        drawText(`CNPJ: ${dadosDaEmpresa.cnpj}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Endereço: ${dadosDaEmpresa.endereco.logradouro}, ${dadosDaEmpresa.endereco.numero}, ${dadosDaEmpresa.endereco.bairro}, ${dadosDaEmpresa.endereco.localidade} - ${dadosDaEmpresa.endereco.uf}`, margin, cursorY);
        cursorY -= 15;
        drawText(`CEP: ${dadosDaEmpresa.endereco.cep} | Telefone: ${dadosDaEmpresa.telefone}`, margin, cursorY);
        cursorY -= 25;

        drawLine(cursorY);
        cursorY -= 20;

        // Dados do cliente
        drawText('Dados do Cliente', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;
        drawText(`Nome: ${user.nome}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Email: ${user.email}`, margin, cursorY);
        cursorY -= 15;
        drawText(`CPF: ${user.cpf ? user.cpf : '--'} | Telefone: ${user.phone ? user.phone : '--'}`, margin, cursorY);
        cursorY -= 15;
        if (user.address) {
            drawText(`Endereço de Entrega: ${user.address.logradouro}, ${user.address.numero}, ${user.address.bairro}, ${user.address.localidade} - ${user.address.uf}`, margin, cursorY);
            cursorY -= 15;
            drawText(`CEP: ${user.address.cep}`, margin, cursorY);
            cursorY -= 20;
        }

        drawLine(cursorY);
        cursorY -= 20;

        // Informações do Pedido
        drawText('Informações do Pedido', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;
        drawText(`ID do Pedido: ${order.id}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Data do Pedido: ${order.createdAt.toDate().toLocaleDateString()}`, margin, cursorY);
        cursorY -= 15;

        // Tabela de itens
        drawText('Itens do Pedido:', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;

        drawText('Produto', margin, cursorY, timesRomanFontBold);
        drawText('Qtd.', margin + 300, cursorY, timesRomanFontBold);
        drawText('Preço Unit.', margin + 350, cursorY, timesRomanFontBold);
        drawText('Subtotal', margin + 450, cursorY, timesRomanFontBold);
        cursorY -= 15;

        drawLine(cursorY);
        cursorY -= 15;

        let subtotal = 0;

        order.cartSnapShot.forEach((item) => {
            const precoFinal = item.value.promotionalPrice > 0 ? item.value.promotionalPrice : item.value.price;
            const itemSubtotal = precoFinal * item.quantidade;
            subtotal += itemSubtotal;

            drawText(item.name, margin, cursorY);
            drawText(`${item.quantidade}`, margin + 300, cursorY);
            drawText(`R$ ${precoFinal.toFixed(2)}`, margin + 350, cursorY);
            drawText(`R$ ${itemSubtotal.toFixed(2)}`, margin + 450, cursorY);
            cursorY -= 15;
        });

        cursorY -= 15;
        drawLine(cursorY);
        cursorY -= 20;

        // Totais organizados
        drawText('Resumo do Pedido:', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;

        drawText(`Subtotal (itens): R$ ${subtotal.toFixed(2)}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Frete: R$ ${order.valor.frete.toFixed(2)}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Total (itens + frete): R$ ${order.valor.total.toFixed(2)}`, margin, cursorY, timesRomanFontBold, 14);

        cursorY -= 30;
        drawLine(cursorY);

        // Gerar PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Romaneio_${order.id}.pdf`;
        link.click();
    };

    return (
        <button
            onClick={ generatePDF }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Gerar Romaneio
        </button>
    );
};

export default GenerateRomaneioButton;
