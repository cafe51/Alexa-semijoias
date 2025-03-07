'use client';

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { StandardFonts } from 'pdf-lib';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { DadosDaEmpresaType } from '@/app/utils/types';
import toTitleCase from '../utils/toTitleCase';
import { formatPrice } from '../utils/formatPrice';

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

        // Cria a primeira página (A4)
        let page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();
        const margin = 50;
        let cursorY = height - margin;

        // Função para desenhar textos
        const drawText = (text: string, x: number, y: number, font = timesRomanFont, size = 12) => {
            page.drawText(text, { x, y, size, font });
        };

        // Função para desenhar linhas
        const drawLine = (y: number, thickness: number = 1) => {
            page.drawLine({
                start: { x: margin, y },
                end: { x: width - margin, y },
                thickness,
                color: rgb(0, 0, 0),
            });
        };

        // Função para desenhar o cabeçalho da tabela
        const drawTableHeader = () => {
            drawText('Produto', margin, cursorY, timesRomanFontBold);
            drawText('Qtd.', margin + 300, cursorY, timesRomanFontBold);
            drawText('Preço Unit.', margin + 350, cursorY, timesRomanFontBold);
            drawText('Subtotal', margin + 450, cursorY, timesRomanFontBold);
            cursorY -= 15;
            drawLine(cursorY);
            cursorY -= 15;
        };

        // Função para adicionar uma nova página e reiniciar o cursor
        const addNewPage = () => {
            page = pdfDoc.addPage([595, 842]);
            cursorY = height - margin;
            // Redesenha o cabeçalho da tabela na nova página
            drawTableHeader();
        };

        // Função para truncar o texto se ele ultrapassar o tamanho máximo
        const truncateText = (text: string, maxLength: number): string => {
            return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
        };

        // Cabeçalho do romaneio
        drawText(dadosDaEmpresa.nome, margin, cursorY, timesRomanFontBold, 16);
        cursorY -= 20;
        drawText(`CNPJ: ${dadosDaEmpresa.cnpj}`, margin, cursorY);
        cursorY -= 15;
        drawText(
            `Endereço: ${dadosDaEmpresa.endereco.logradouro}, ${dadosDaEmpresa.endereco.numero}, ${dadosDaEmpresa.endereco.bairro}, ${dadosDaEmpresa.endereco.localidade} - ${dadosDaEmpresa.endereco.uf}`,
            margin,
            cursorY,
        );
        cursorY -= 15;
        drawText(`CEP: ${dadosDaEmpresa.endereco.cep} | Telefone: ${dadosDaEmpresa.telefone}`, margin, cursorY);
        cursorY -= 25;

        drawLine(cursorY);
        cursorY -= 20;

        // Dados do cliente
        drawText('Dados do(a) Cliente', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;
        drawText(`Nome: ${user.nome}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Email: ${user.email}`, margin, cursorY);
        cursorY -= 15;
        drawText(`CPF: ${user.cpf ? user.cpf : '--'} | Telefone: ${user.phone ? user.phone : '--'}`, margin, cursorY);
        cursorY -= 15;
        if (user.address) {
            drawText(
                `Endereço de Entrega: ${user.address.logradouro}, ${user.address.numero}, ${user.address.bairro}, ${user.address.localidade} - ${user.address.uf}`,
                margin,
                cursorY,
            );
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
        // Formata a data para dd/mm/aaaa
        const createdAt = order.createdAt.toDate();
        const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${createdAt.getFullYear()}`;
        drawText(`Data do Pedido: ${formattedDate}`, margin, cursorY);
        cursorY -= 15;

        // Espaçamento extra e divisor estilizado entre seções
        cursorY -= 10;
        drawLine(cursorY, 2); // Linha divisória mais grossa
        cursorY -= 20;

        const totalQuantiTy = order.cartSnapShot.map(({ quantidade }) => quantidade).reduce((a, b) => a + b, 0);
        // Seção de Itens do Pedido
        drawText(`Itens do Pedido (${totalQuantiTy}): `, margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;

        // Desenha o cabeçalho da tabela na primeira página
        drawTableHeader();

        let subtotal = 0;
        const gapBetweenRows = 5;

        order.cartSnapShot.forEach((item, index) => {
            const hasCustomProps = item.customProperties && Object.keys(item.customProperties).length > 0;
            const rowHeight = hasCustomProps ? 35 : 20;
            // Verifica se há espaço suficiente para a linha + gap
            if (cursorY - (rowHeight + gapBetweenRows) < margin) {
                addNewPage();
            }

            // Fundo alternado para a linha
            const backgroundColor = (index % 2 === 1) ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1);
            page.drawRectangle({
                x: margin,
                y: cursorY - rowHeight,
                width: width - margin * 2,
                height: rowHeight,
                color: backgroundColor,
            });

            // Coluna "Produto": nome truncado e customProperties (se houver) em linha adicional
            const displayName = truncateText(item.name, 45);
            drawText(displayName, margin + 5, cursorY - 12, timesRomanFont, 12);
            if (hasCustomProps) {
                const customPropsText = Object.entries(item.customProperties!)
                    .map(([key, value]) => `${toTitleCase(key)}: ${toTitleCase(value)}`)
                    .join(', ');
                drawText(customPropsText, margin + 5, cursorY - 27, timesRomanFont, 10);
            }

            // Colunas "Qtd.", "Preço Unit." e "Subtotal"
            drawText(`${item.quantidade}`, margin + 300, cursorY - 12, timesRomanFont, 12);
            const precoFinal = item.value.promotionalPrice > 0 ? item.value.promotionalPrice : item.value.price;
            const itemSubtotal = precoFinal * item.quantidade;
            subtotal += itemSubtotal;
            drawText(`R$ ${precoFinal.toFixed(2)}`, margin + 350, cursorY - 12, timesRomanFont, 12);
            drawText(`R$ ${itemSubtotal.toFixed(2)}`, margin + 450, cursorY - 12, timesRomanFont, 12);

            // Atualiza o cursor para a próxima linha (incluindo o gap)
            cursorY -= (rowHeight + gapBetweenRows);
        });

        cursorY -= 15;
        // Garante espaço para o resumo; se necessário, adiciona nova página
        if (cursorY - 20 < margin) {
            addNewPage();
        }
        drawLine(cursorY);
        cursorY -= 20;

        // Totais organizados
        drawText('Resumo do Pedido:', margin, cursorY, timesRomanFontBold, 14);
        cursorY -= 20;
        drawText(`Subtotal (itens): ${formatPrice(subtotal)}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Desconto: ${formatPrice(Number((parseFloat(subtotal.toFixed(2)) - parseFloat(order.valor.total.toFixed(2))).toFixed(2)))}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Frete: ${formatPrice(order.valor.frete)}`, margin, cursorY);
        cursorY -= 15;
        drawText(`Total (subtotal - desconto + frete): ${formatPrice(order.valor.total)}`, margin, cursorY, timesRomanFontBold, 14);

        cursorY -= 30;
        drawLine(cursorY);

        // Gera o PDF
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
