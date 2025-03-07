'use client';

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { StandardFonts } from 'pdf-lib';
import { UserType, FireBaseDocument, DadosRemetenteType } from '@/app/utils/types';

interface GenerateShippingLabelButtonProps {
  user: UserType & FireBaseDocument;
  dadosDaEmpresa: DadosRemetenteType;
}

const GenerateShippingLabelButton: React.FC<GenerateShippingLabelButtonProps> = ({ user, dadosDaEmpresa }) => {
    const generatePDF = async() => {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // Cria a página em tamanho A4
        const page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();
        const margin = 50;
        let cursorY = height - margin;

        cursorY -= 30;

        // Seção: Remetente (Dados da Empresa)
        page.drawText('Remetente:', {
            x: margin,
            y: cursorY,
            size: 14,
            font: timesRomanFontBold,
        });
        cursorY -= 20;
        page.drawText(dadosDaEmpresa.nome, {
            x: margin,
            y: cursorY,
            size: 12,
            font: timesRomanFont,
        });
        cursorY -= 15;
        cursorY -= 15;
        page.drawText(
            `Endereço: ${dadosDaEmpresa.endereco.logradouro}, ${dadosDaEmpresa.endereco.numero}, ${dadosDaEmpresa.endereco.bairro}`,
            {
                x: margin,
                y: cursorY,
                size: 12,
                font: timesRomanFont,
            },
        );
        cursorY -= 15;
        page.drawText(
            `${dadosDaEmpresa.endereco.localidade} - ${dadosDaEmpresa.endereco.uf}, CEP: ${dadosDaEmpresa.endereco.cep}`,
            {
                x: margin,
                y: cursorY,
                size: 12,
                font: timesRomanFont,
            },
        );
        cursorY -= 15;
        page.drawText(`Telefone: ${dadosDaEmpresa.telefone}`, {
            x: margin,
            y: cursorY,
            size: 12,
            font: timesRomanFont,
        });
        cursorY -= 25;

        // Divisor estilizado entre seções
        page.drawLine({
            start: { x: margin, y: cursorY },
            end: { x: width - margin, y: cursorY },
            thickness: 2,
            color: rgb(0, 0, 0),
        });
        cursorY -= 20;

        // Seção: Destinatário (Dados do Usuário)
        page.drawText('Destinatário:', {
            x: margin,
            y: cursorY,
            size: 14,
            font: timesRomanFontBold,
        });
        cursorY -= 20;
        page.drawText(user.nome, {
            x: margin,
            y: cursorY,
            size: 12,
            font: timesRomanFont,
        });
        cursorY -= 15;


        cursorY -= 15;
        if (user.address) {
            page.drawText(
                `Endereço: ${user.address.logradouro}, ${user.address.numero}, ${user.address.bairro}`,
                {
                    x: margin,
                    y: cursorY,
                    size: 12,
                    font: timesRomanFont,
                },
            );
            cursorY -= 15;
            page.drawText(
                `${user.address.localidade} - ${user.address.uf}, CEP: ${user.address.cep}`,
                {
                    x: margin,
                    y: cursorY,
                    size: 12,
                    font: timesRomanFont,
                },
            );
            cursorY -= 15;
        }
        if (user.phone) {
            page.drawText(`Telefone: ${user.phone}`, {
                x: margin,
                y: cursorY,
                size: 12,
                font: timesRomanFont,
            });
            cursorY -= 15;
        }

        // Desenha um contorno em volta do conteúdo da etiqueta
        const labelHeight = height - margin - cursorY + 20;
        page.drawRectangle({
            x: margin - 10,
            y: cursorY - 10,
            width: width - margin * 2 + 20,
            height: labelHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Gera o PDF e força o download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Etiqueta_Entrega_${user.nome}.pdf`;
        link.click();
    };

    return (
        <button
            onClick={ generatePDF }
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
      Gerar Etiqueta de Entrega
        </button>
    );
};

export default GenerateShippingLabelButton;
