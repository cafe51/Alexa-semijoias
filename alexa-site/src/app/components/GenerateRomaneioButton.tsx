'use client';

import { useState } from 'react';
import { PDFDocument, rgb, PDFFont, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { FireBaseDocument, OrderType, UserType, DadosDaEmpresaType } from '@/app/utils/types'; // Ajuste o import conforme necessário
import toTitleCase from '../utils/toTitleCase'; // Ajuste o import conforme necessário
import { formatPrice } from '../utils/formatPrice'; // Ajuste o import conforme necessário

interface GenerateRomaneioButtonProps {
    order: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
    dadosDaEmpresa: DadosDaEmpresaType;
}

const GenerateRomaneioButton: React.FC<GenerateRomaneioButtonProps> = ({ order, user, dadosDaEmpresa }) => {
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async() => {
        setIsLoading(true);
        try {
            const pdfDoc = await PDFDocument.create();
            // Necessário se for usar fontes customizadas, mas mal não faz manter
            pdfDoc.registerFontkit(fontkit);

            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

            let page = pdfDoc.addPage([595, 842]); // A4 Size
            const { width, height } = page.getSize();
            const margin = 50;
            let cursorY = height - margin;

            // --- Helper Functions ---

            // Função para desenhar texto com suporte a quebra de linha simples
            const drawText = (text: string, x: number, y: number, font: PDFFont = timesRomanFont, size = 12, maxWidth?: number) => {
                if (!text) return 0; // Proteção contra texto vazio

                if (!maxWidth) {
                    page.drawText(text, { x, y, size, font });
                    return 1; // 1 linha usada
                }

                const words = text.split(' ');
                let line = '';
                let currentY = y;
                let linesCount = 0;

                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    const testWidth = font.widthOfTextAtSize(testLine, size);
                    
                    if (testWidth > maxWidth && n > 0) {
                        page.drawText(line, { x, y: currentY, size, font });
                        line = words[n] + ' ';
                        currentY -= size + 2; // Espaço entre linhas (leading)
                        linesCount++;
                    } else {
                        line = testLine;
                    }
                }
                page.drawText(line, { x, y: currentY, size, font });
                return linesCount + 1;
            };

            const drawLine = (y: number, thickness: number = 1) => {
                page.drawLine({
                    start: { x: margin, y },
                    end: { x: width - margin, y },
                    thickness,
                    color: rgb(0, 0, 0),
                });
            };

            const drawTableHeader = () => {
                const headerY = cursorY;
                drawText('Produto', margin, headerY, timesRomanFontBold);
                drawText('Qtd.', margin + 300, headerY, timesRomanFontBold);
                drawText('Preço Unit.', margin + 350, headerY, timesRomanFontBold);
                drawText('Subtotal', margin + 450, headerY, timesRomanFontBold);
                
                cursorY -= 15;
                drawLine(cursorY);
                cursorY -= 15;
            };

            const addNewPage = () => {
                page = pdfDoc.addPage([595, 842]);
                cursorY = height - margin;
                drawTableHeader();
            };

            const checkPageBreak = (neededSpace: number) => {
                if (cursorY - neededSpace < margin) {
                    addNewPage();
                }
            };

            // --- Conteúdo do PDF ---

            // 1. Cabeçalho da Empresa
            drawText(dadosDaEmpresa.nome, margin, cursorY, timesRomanFontBold, 16);
            cursorY -= 20;
            drawText(`CNPJ: ${dadosDaEmpresa.cnpj}`, margin, cursorY);
            cursorY -= 15;

            const enderecoEmpresa = `Endereço: ${dadosDaEmpresa.endereco.logradouro}, ${dadosDaEmpresa.endereco.numero}, ${dadosDaEmpresa.endereco.bairro}, ${dadosDaEmpresa.endereco.localidade} - ${dadosDaEmpresa.endereco.uf}`;
            const linhasEmpresa = drawText(enderecoEmpresa, margin, cursorY, timesRomanFont, 12, width - (margin * 2));
            cursorY -= (15 * linhasEmpresa);

            drawText(`CEP: ${dadosDaEmpresa.endereco.cep} | Telefone: ${dadosDaEmpresa.telefone}`, margin, cursorY);
            cursorY -= 25;

            drawLine(cursorY);
            cursorY -= 20;

            // 2. Dados do Cliente
            drawText('Dados do(a) Cliente', margin, cursorY, timesRomanFontBold, 14);
            cursorY -= 20;
            drawText(`Nome: ${user.nome}`, margin, cursorY);
            cursorY -= 15;
            drawText(`Email: ${user.email}`, margin, cursorY);
            cursorY -= 15;
            drawText(`CPF: ${user.cpf || '--'} | Telefone: ${user.phone || '--'}`, margin, cursorY);
            cursorY -= 15;

            if (user.address) {
                const enderecoCliente = `Endereço de Entrega: ${user.address.logradouro}, ${user.address.numero}, ${user.address.bairro}, ${user.address.localidade} - ${user.address.uf}`;
                const linhasEnd = drawText(enderecoCliente, margin, cursorY, timesRomanFont, 12, width - (margin * 2));
                cursorY -= (15 * linhasEnd);

                // --- NOVA LÓGICA: Referência ---
                // Verifica se existe E se não é só espaços em branco
                if (user.address.referencia && user.address.referencia.trim() !== '') {
                    const refText = `Referência: ${user.address.referencia}`;
                    const linhasRef = drawText(refText, margin, cursorY, timesRomanFont, 12, width - (margin * 2));
                    cursorY -= (15 * linhasRef);
                }

                drawText(`CEP: ${user.address.cep}`, margin, cursorY);
                cursorY -= 20;
            }

            drawLine(cursorY);
            cursorY -= 20;

            // 3. Informações do Pedido
            drawText('Informações do Pedido', margin, cursorY, timesRomanFontBold, 14);
            cursorY -= 20;
            drawText(`ID do Pedido: ${order.id}`, margin, cursorY);
            cursorY -= 15;
            
            // Adicionado Pagamento para ficar mais completo
            drawText(`Forma de Pagamento: ${toTitleCase(order.paymentOption)}`, margin, cursorY); 
            cursorY -= 15;

            const createdAt = order.createdAt.toDate();
            const formattedDate = createdAt.toLocaleDateString('pt-BR');
            const formattedTime = createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            drawText(`Data do Pedido: ${formattedDate} às ${formattedTime}`, margin, cursorY);
            cursorY -= 15;

            cursorY -= 10;
            drawLine(cursorY, 2);
            cursorY -= 20;

            const totalQuantity = order.cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0);
            drawText(`Itens do Pedido (${totalQuantity}): `, margin, cursorY, timesRomanFontBold, 14);
            cursorY -= 20;

            drawTableHeader();

            // 4. Loop de Itens
            let subtotalCalculado = 0;

            for (let i = 0; i < order.cartSnapShot.length; i++) {
                const item = order.cartSnapShot[i];
                const hasCustomProps = item.customProperties && Object.keys(item.customProperties).length > 0;

                const baseHeight = 20;
                const extraHeight = hasCustomProps ? 15 : 0;
                const rowHeight = baseHeight + extraHeight;

                checkPageBreak(rowHeight + 5);

                // Zebra Striping
                if (i % 2 === 1) {
                    page.drawRectangle({
                        x: margin,
                        y: cursorY - rowHeight + 8,
                        width: width - margin * 2,
                        height: rowHeight,
                        color: rgb(0.95, 0.95, 0.95),
                    });
                }

                const nameFontSize = 10;
                let displayName = item.name;
                // Truncar nome se muito longo
                while (timesRomanFont.widthOfTextAtSize(displayName, nameFontSize) > 280) {
                    displayName = displayName.slice(0, -4) + '...';
                }

                drawText(displayName, margin + 5, cursorY, timesRomanFont, nameFontSize);

                if (hasCustomProps) {
                    const customPropsText = Object.entries(item.customProperties!)
                        .map(([key, value]) => `${toTitleCase(key)}: ${toTitleCase(value)}`)
                        .join(', ');
                    drawText(customPropsText, margin + 5, cursorY - 12, timesRomanFont, 9, 280);
                }

                const precoFinal = item.value.promotionalPrice > 0 ? item.value.promotionalPrice : item.value.price;
                const itemSubtotal = precoFinal * item.quantidade;
                subtotalCalculado += itemSubtotal;

                drawText(`${item.quantidade}`, margin + 300, cursorY, timesRomanFont, 11);
                drawText(formatPrice(precoFinal), margin + 350, cursorY, timesRomanFont, 11);
                drawText(formatPrice(itemSubtotal), margin + 450, cursorY, timesRomanFont, 11);

                cursorY -= (rowHeight + 5);
            }

            cursorY -= 15;
            checkPageBreak(120);
            drawLine(cursorY);
            cursorY -= 20;

            // 5. Totais
            const valorSubtotal = subtotalCalculado;
            const valorFrete = order.valor.frete;
            const valorTotalPago = order.valor.total;
            const valorDesconto = Math.max(0, (valorSubtotal + valorFrete) - valorTotalPago);

            drawText('Resumo do Pedido:', margin, cursorY, timesRomanFontBold, 14);
            cursorY -= 20;

            const labelX = margin;
            const valueX = margin + 200;

            drawText('Subtotal (itens):', labelX, cursorY);
            drawText(formatPrice(valorSubtotal), valueX, cursorY);
            cursorY -= 15;

            drawText('Frete:', labelX, cursorY);
            drawText(formatPrice(valorFrete), valueX, cursorY);
            cursorY -= 15;

            // --- NOVA LÓGICA: Desconto ---
            // Só exibe se for maior que zero (usando 0.01 para evitar problemas de ponto flutuante)
            if (valorDesconto > 0.01) {
                drawText('Desconto:', labelX, cursorY);
                drawText(`- ${formatPrice(valorDesconto)}`, valueX, cursorY);
                cursorY -= 15;
            }

            drawText('Total:', labelX, cursorY, timesRomanFontBold, 14);
            drawText(formatPrice(valorTotalPago), valueX, cursorY, timesRomanFontBold, 14);

            cursorY -= 30;
            drawLine(cursorY);

            const generationDate = new Date().toLocaleString('pt-BR');
            drawText(`Gerado em: ${generationDate}`, margin, 30, timesRomanFont, 9);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Romaneio_${order.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erro ao gerar romaneio:', error);
            alert('Houve um erro ao gerar o PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={ generatePDF }
            disabled={ isLoading }
            className={ `px-4 py-2 rounded text-white transition-colors font-medium shadow-sm ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }` }
        >
            { isLoading ? 'Gerando...' : 'Gerar Romaneio' }
        </button>
    );
};

export default GenerateRomaneioButton;