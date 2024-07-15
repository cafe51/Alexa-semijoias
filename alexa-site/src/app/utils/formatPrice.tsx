//app/utils/formatPrice.tsx

export default function formatPrice(valor: number): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, // Garante sempre duas casas decimais
    });

    return formatador.format(valor);
}