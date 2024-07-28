//app/utils/formatPrice.tsx

export default function formatPrice(valor: number | null | undefined): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, // Garante sempre duas casas decimais
    });

    if (!valor) return formatador.format(0);

    return formatador.format(valor);
}