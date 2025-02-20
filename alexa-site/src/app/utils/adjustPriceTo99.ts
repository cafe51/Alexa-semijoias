// Função auxiliar para ajustar preço para terminar com .99
export default function adjustPriceTo99(price: number): number {
    const integerPart = Math.floor(price);
    return integerPart + 0.99;
}