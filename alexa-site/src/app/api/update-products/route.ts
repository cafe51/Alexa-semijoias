import { NextResponse } from 'next/server';
import { updateProducts } from '../../../../scripts/updateProducts';

export async function POST() {
    try {
        await updateProducts();
        return NextResponse.json({ message: 'Produtos atualizados com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        return NextResponse.json({ message: 'Erro ao atualizar produtos' }, { status: 500 });
    }
}
