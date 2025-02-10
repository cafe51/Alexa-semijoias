// app/api/generate-description/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Certifique-se de que a variável de ambiente esteja definida
});

export async function POST(request: Request) {
    try {
        const { title, images, previousDescriptions } = await request.json();

        // Constrói o conteúdo da mensagem como um array de partes, conforme exigido pelo modelo com visão.
        const messageContent: any[] = [];

        // Instrução inicial para o modelo
        messageContent.push({
            type: 'text',
            text: 'Você é um especialista em marketing digital e redator publicitário para e-commerce. Por favor, analise as imagens a seguir juntamente com o título do produto e gere uma descrição única, atraente e detalhada que ressalte os pontos fortes do produto e incentive a compra. ',
        });

        if (title && title.trim().length > 0) {
            messageContent.push({
                type: 'text',
                text: `Título do produto: ${title}. `,
            });
        }

        // Para cada imagem (em Base64) adiciona um objeto de imagem com alta resolução de detalhe.
        if (images && images.length > 0) {
            for (const base64Img of images) {
                messageContent.push({
                    type: 'image_url',
                    image_url: {
                        url: base64Img, // Ex.: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                        detail: 'high',
                    },
                });
            }
        }

        if (previousDescriptions && previousDescriptions.length > 0) {
            messageContent.push({
                type: 'text',
                text: `Evite descrições iguais às seguintes: ${previousDescriptions.join(' | ')}. `,
            });
        }

        messageContent.push({
            type: 'text',
            text: 'Gere uma descrição única e detalhada para o produto.',
        });

        // Chama o OpenAI com a mensagem construída
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Use o nome do modelo que está funcionando para você
            messages: [
                {
                    role: 'user',
                    content: messageContent,
                },
            ],
            temperature: 0.7,
        });

        const description = response.choices[0].message?.content?.trim();

        if (!description) {
            return NextResponse.json({ error: 'Nenhuma descrição gerada.' }, { status: 500 });
        }

        return NextResponse.json({ description });
    } catch (error) {
        console.error('Erro na geração de descrição:', error);
        return NextResponse.json({ error: 'Erro ao gerar descrição.' }, { status: 500 });
    }
}
