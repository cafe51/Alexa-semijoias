export default function marginProfitValue(v: { price: number, promotionalPrice: number, cost: number, }) {
    const finalPrice = v.promotionalPrice && v.promotionalPrice > 0 ? v.promotionalPrice : v.price;
    const profit = (finalPrice - v.cost);
    const margin = profit/finalPrice;
    return margin * 100;
}