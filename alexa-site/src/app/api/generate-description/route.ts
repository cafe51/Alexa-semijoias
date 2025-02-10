// app/api/generate-description/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Certifique-se de que a variável de ambiente esteja definida
});

// Função auxiliar para baixar a imagem e convertê-la para Base64
async function fetchImageAsBase64(url: string): Promise<string> {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Erro ao baixar imagem da URL: ${url}`);
            return url; // fallback: retorna a URL se houver erro
        }
        // Obtém o conteúdo da imagem como ArrayBuffer
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Tenta obter o content-type dos headers; se não disponível, assume "image/jpeg"
        const contentType = res.headers.get('content-type') || 'image/jpeg';
        return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (err) {
        console.error('Erro ao converter imagem para base64:', err);
        return url; // fallback: retorna a URL
    }
}

export async function POST(request: Request) {
    try {
        const { title, images, previousDescriptions } = await request.json();

        // Constrói o conteúdo da mensagem como um array de partes, conforme exigido pelo modelo com visão.
        const messageContent: any[] = [];

        // Instrução inicial: contextualização e objetivo da copy.
        messageContent.push({
            type: 'text',
            text: 'Você é um especialista em marketing digital e redator publicitário para e-commerce. Analise cuidadosamente as imagens fornecidas e o título (quando disponível) do produto para criar uma descrição única, persuasiva e detalhada, que destaque os pontos fortes do produto e incentive a compra.',
        });

        // Detalhamento sobre o tipo de produto e atributos a serem ressaltados.
        messageContent.push({
            type: 'text',
            text: 'Considere que os produtos podem ser semijoias banhadas a ouro 18k ou peças em aço inox, ambas reconhecidas pela beleza, qualidade e durabilidade. Sua copy deve realçar os atributos do produto, evidenciando detalhes únicos presentes nas imagens (como design, cores e texturas) e conectando emocionalmente com o público.',
        });

        // Instrução para uma análise minuciosa e restrição quanto ao termo indesejado.
        messageContent.push({
            type: 'text',
            text: 'Evite fazer qualquer referência à superstições ou coisas do tipo.',
        });

        messageContent.push({
            type: 'text',
            text: 'Antes de criar a descrição, faça uma análise minuciosa das imagens e, se houver, do título do produto. Evite repetir descrições anteriores e, sempre que possível, não utilize a palavra "sofisticado" (substitua-a por termos mais apropriados ou remova-a).',
        });

        // Exemplos de descrições para referência.
        messageContent.push({
            type: 'text',
            text: `Abaixo seguem alguns exemplos de descrições para referência (note que, mesmo que alguns exemplos contenham a palavra "sofisticado", evite usá-la na resposta):

"✨ Um toque de modernidade e elegância! ✨
Com um design marcante, esse brinco de argola com três fios torcidos combina textura e brilho em uma peça única e versátil. Disponível em tons prateado e dourado, ele é perfeito para quem busca um acessório refinado para elevar qualquer look. Feito em aço inox, garante durabilidade e conforto para o uso diário.

🐍 O poder e a sedução da serpente no seu look! 🐍
Esse anel ousado traz o formato de uma serpente envolvendo o dedo em duas voltas, simbolizando transformação, proteção e sabedoria. Seu design envolvente se ajusta perfeitamente, criando um efeito impactante e marcante. Produzido em aço inox, ele é resistente e perfeito para quem ama acessórios com significado! ✨

🕊️ Fé e proteção em uma joia especial! 🕊️
Esse colar carrega um profundo significado espiritual com seu pingente do Fruto do Espírito Santo, representando paz, amor e esperança. Seu design detalhado transmite delicadeza, tornando-se uma peça perfeita para expressar sua fé com estilo. Um acessório elegante e cheio de luz para iluminar seus dias! ✨

💖 Um acessório repleto de amor e significado! 💖
Essa pulseira encantadora combina charme e delicadeza com seus berloques de corações lisos, perfeitos para representar momentos especiais e pessoas queridas. Os separadores em aço inox adicionam um toque único e garantem um caimento impecável no pulso. Uma peça cheia de sentimento para quem ama acessórios marcantes! ✨

💎 Brilho e requinte em cada detalhe! 💎
Esse conjunto deslumbrante combina microzircônias cravejadas e baguetes brilhantes, criando um efeito luxuoso e marcante. O design redondo equilibra modernidade e elegância, sendo perfeito para ocasiões especiais ou para quem ama um toque de glamour no dia a dia. Feito com materiais de alta qualidade, esse conjunto é um verdadeiro destaque! ✨`,
        });

        // Instrução final para gerar a descrição.
        messageContent.push({
            type: 'text',
            text: 'Gere uma descrição única e detalhada para o produto, integrando todas as informações anteriores de forma criativa e envolvente.',
        });

        // Se houver título, adiciona-o à mensagem.
        if (title && title.trim().length > 0) {
            messageContent.push({
                type: 'text',
                text: `O solicitante definiu o produto em poucas palavras como: "${title}". Infelizmente o solicitante não é bom o suficiente pra criar descrições. Agora cabe a você criar a descrição, por favor.`,
            });

            messageContent.push({
                type: 'text',
                text: ` "Evite usar o termo ${title} exatamente como informou o solicitante. Afinal esse não é o nome do produto, é apenas uma descrição limitada feita pelo solicitante. Evite usar esse termo na chamada inicial, procure ser criativo".`,
            });
        }

        // Processa apenas as duas primeiras imagens.
        if (images && images.length > 0) {
            // Seleciona as duas primeiras imagens (índices 0 e 1)
            const imagesToProcess = images.slice(0, 2);
            // Para cada imagem: se já estiver em Base64, usa-a; caso contrário, baixa e converte.
            const processedImages = await Promise.all(
                imagesToProcess.map(async(img: string) => {
                    if (img.startsWith('data:')) {
                        return img;
                    } else {
                        return await fetchImageAsBase64(img);
                    }
                }),
            );
            // Adiciona cada imagem convertida à mensagem.
            for (const base64Img of processedImages) {
                messageContent.push({
                    type: 'image_url',
                    image_url: {
                        url: base64Img,
                        detail: 'auto',
                    },
                });
            }
        }

        // Se houver descrições anteriores, adicione uma instrução para evitá-las.
        if (previousDescriptions && previousDescriptions.length > 0) {
            messageContent.push({
                type: 'text',
                text: `Evite descrições iguais às seguintes: ${previousDescriptions.join(' | ')}.`,
            });
        }

        // Chama o OpenAI com a mensagem construída
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Use o modelo que está funcionando para você
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
