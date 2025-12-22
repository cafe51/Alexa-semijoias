'use client';

import { useState } from 'react';
import { PDFDocument, rgb, PDFFont, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { UserType, FireBaseDocument, DadosDaEmpresaType } from '@/app/utils/types';

interface GenerateShippingLabelButtonProps {
    user: UserType & FireBaseDocument;
    dadosDaEmpresa: DadosDaEmpresaType;
}

const GenerateShippingLabelButton: React.FC<GenerateShippingLabelButtonProps> = ({ user, dadosDaEmpresa }) => {
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async() => {
        setIsLoading(true);
        try {
            const pdfDoc = await PDFDocument.create();
            pdfDoc.registerFontkit(fontkit);

            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

            // Cria a página em tamanho A4
            const page = pdfDoc.addPage([595, 842]);
            const { width, height } = page.getSize();
            
            // Configurações da Etiqueta
            const margin = 50;
            const boxWidth = width - (margin * 2);
            const cursorY = height - margin; // Ponto inicial superior
            const startY = cursorY; // Guarda o Y inicial para desenhar a borda depois

            // --- Helper: Função de Texto com Quebra de Linha ---
            const drawText = (text: string, x: number, y: number, font: PDFFont = timesRomanFont, size = 12, maxWidth: number) => {
                if (!text) return 0;

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
                        currentY -= size + 2; 
                        linesCount++;
                    } else {
                        line = testLine;
                    }
                }
                page.drawText(line, { x, y: currentY, size, font });
                return linesCount + 1;
            };

            // ==========================================
            // 1. SEÇÃO: REMETENTE (Topo, menor destaque)
            // ==========================================
            
            const padding = 15;
            let currentTextY = cursorY - padding - 10; 
            const textX = margin + padding;
            const textMaxWidth = boxWidth - (padding * 2);

            page.drawText('REMETENTE:', { x: textX, y: currentTextY, size: 10, font: timesRomanFontBold });
            currentTextY -= 15;

            // Nome da Empresa
            page.drawText(dadosDaEmpresa.razaoSocial.toUpperCase(), { x: textX, y: currentTextY, size: 10, font: timesRomanFont });
            currentTextY -= 12;

            // CNPJ da Empresa (Adicionado)
            page.drawText(`CNPJ: ${dadosDaEmpresa.cnpj}`, { x: textX, y: currentTextY, size: 10, font: timesRomanFont });
            currentTextY -= 12;

            const endEmpresa = `${dadosDaEmpresa.endereco.logradouro}, ${dadosDaEmpresa.endereco.numero} - ${dadosDaEmpresa.endereco.bairro}`;
            const linhasEndEmp = drawText(endEmpresa, textX, currentTextY, timesRomanFont, 10, textMaxWidth);
            currentTextY -= (12 * linhasEndEmp);

            const cidEmpresa = `${dadosDaEmpresa.endereco.localidade} - ${dadosDaEmpresa.endereco.uf}`;
            drawText(cidEmpresa, textX, currentTextY, timesRomanFont, 10, textMaxWidth);
            currentTextY -= 12;

            drawText(`CEP: ${dadosDaEmpresa.endereco.cep}`, textX, currentTextY, timesRomanFont, 10, textMaxWidth);
            currentTextY -= 20;

            // Linha divisória
            page.drawLine({
                start: { x: margin, y: currentTextY },
                end: { x: width - margin, y: currentTextY },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
            
            currentTextY -= 25; 

            // ==========================================
            // 2. SEÇÃO: DESTINATÁRIO (Meio, destaque grande)
            // ==========================================

            page.drawText('DESTINATÁRIO:', { x: textX, y: currentTextY, size: 14, font: timesRomanFontBold });
            currentTextY -= 25;

            // Nome do Cliente em destaque
            const linhasNome = drawText(user.nome.toUpperCase(), textX, currentTextY, timesRomanFontBold, 16, textMaxWidth);
            currentTextY -= (20 * linhasNome);
            currentTextY -= 5; 

            if (user.address) {
                const endCliente = `${user.address.logradouro}, ${user.address.numero}`;
                const linhasEndCli = drawText(endCliente, textX, currentTextY, timesRomanFont, 14, textMaxWidth);
                currentTextY -= (18 * linhasEndCli);

                const bairroCliente = `Bairro: ${user.address.bairro}`;
                drawText(bairroCliente, textX, currentTextY, timesRomanFont, 14, textMaxWidth);
                currentTextY -= 18;

                // Referência (Texto alterado para "Referência:")
                if (user.address.referencia && user.address.referencia.trim() !== '') {
                    const refText = `Referência: ${user.address.referencia}`;
                    const linhasRef = drawText(refText, textX, currentTextY, timesRomanFont, 12, textMaxWidth);
                    currentTextY -= (16 * linhasRef);
                }

                const cidadeCliente = `${user.address.localidade} - ${user.address.uf}`;
                drawText(cidadeCliente, textX, currentTextY, timesRomanFont, 14, textMaxWidth);
                currentTextY -= 25;

                // CEP Grande
                page.drawText(`CEP: ${user.address.cep}`, { 
                    x: textX, 
                    y: currentTextY, 
                    size: 18, 
                    font: timesRomanFontBold, 
                });
                currentTextY -= 25;
            }

            if (user.phone) {
                currentTextY -= 5;
                drawText(`Tel: ${user.phone}`, textX, currentTextY, timesRomanFont, 12, textMaxWidth);
                currentTextY -= 20;
            }

            // ==========================================
            // 3. DESENHAR A BORDA FINAL
            // ==========================================
            
            currentTextY -= 10;
            const boxHeight = startY - currentTextY;

            // Desenha o retângulo em volta de tudo
            page.drawRectangle({
                x: margin,
                y: currentTextY,
                width: boxWidth,
                height: boxHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 2,
            });

            // Linha de corte
            page.drawText('- - - - - - - - - - - - - Corte Aqui - - - - - - - - - - - - -', {
                x: margin + 20,
                y: currentTextY - 30,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.5, 0.5, 0.5),
            });

            // Gera o PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Etiqueta_${user.nome.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erro ao gerar etiqueta:', error);
            alert('Erro ao gerar a etiqueta de envio.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={ generatePDF }
            disabled={ isLoading }
            className={ `px-4 py-2 rounded text-white font-medium transition-colors shadow-sm ${
                isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }` }
        >
            { isLoading ? 'Gerando...' : 'Gerar Etiqueta de Entrega' }
        </button>
    );
};

export default GenerateShippingLabelButton;