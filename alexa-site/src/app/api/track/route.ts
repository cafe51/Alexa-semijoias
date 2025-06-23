// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Evento = {
  tipo: string
  descricao: string
  data: string
  local: string
}

type RastroResponse = {
  codigoObjeto: string
  eventos: Evento[]
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get('codigo') || '';

    if (!codigo) {
        return NextResponse.json({ error: 'Falta o código de rastreio' }, { status: 400 });
    }

    const user = process.env.CORREIOS_USUARIO;
    const pass = process.env.CORREIOS_SENHA;
    const cartao = process.env.CORREIOS_CARTAO;
    const baseUrl = process.env.CORREIOS_API_BASE_URL || 'https://api.correios.com.br';
    // const contrato = process.env.CORREIOS_CONTRATO;

    if (!user || !pass || !cartao) {
        return NextResponse.json({ error: 'Credenciais dos Correios não configuradas' }, { status: 500 });
    }

    try {
    // 1. Obter token JWT
        const tokenRes = await fetch(`${baseUrl}/token/v1/autentica/cartaopostagem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
            },
            body: JSON.stringify({ numero: cartao }),
        });

        console.log('******************');
        console.log('******************');
        console.log('                   ');
        console.log('                   ');
        console.log('user', user);
        console.log('pass', pass);
        console.log('cartao', cartao);
        console.log('baseUrl', baseUrl);
        console.log('baseUrl', baseUrl);
        console.log('                   ');
        console.log('                   ');
        console.log('******************');
        console.log('******************');



        if (!tokenRes.ok) {
            throw new Error(`Falha ao obter token: ${tokenRes.statusText}`);
        }

        const tokenJson = await tokenRes.json();
        const token = tokenJson.Token || tokenJson.token || tokenJson.tokenCartaoPostagem;

        if (!token) {
            throw new Error('Token não retornado pela API dos Correios');
        }

        // 2. Consultar rastreamento com Bearer Token
        const trackRes = await fetch(`${baseUrl}/rastro/v1/objetos/${encodeURIComponent(codigo)}?resultado=T`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!trackRes.ok) {
            const errText = await trackRes.text();
            throw new Error(`Erro na consulta: ${trackRes.status} ${errText}`);
        }

        const trackJson = await trackRes.json();
        const objeto = trackJson.objetos?.[0];

        if (!objeto) {
            return NextResponse.json({ error: 'Objeto não encontrado nos Correios' }, { status: 404 });
        }

        const eventos: Evento[] = (objeto.eventos || []).map((ev: any) => ({
            tipo: ev.codigo || '',
            descricao: ev.descricao || '',
            data: ev.dthrCriado || '',
            local: ev.unidade ? `${ev.unidade.endereco.cidade}/${ev.unidade.endereco.uf}` : '',
        }));

        const response: RastroResponse = {
            codigoObjeto: objeto.codObjeto || codigo,
            eventos,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('API /api/track error:', error);
        return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
    }
}
