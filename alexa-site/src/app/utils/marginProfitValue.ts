export function marginProfitValue({ price, promotionalPrice, cost }: { price: number, promotionalPrice: number, cost: number }) {
    const finalPrice = promotionalPrice > 0 ? promotionalPrice : price;
    if (finalPrice <= 0 || cost <= 0) return 0;

    const profit = finalPrice - cost;
    return (profit / finalPrice) * 100;
}