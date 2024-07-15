// app/checkout/OrderSummarySection/PriceSummarySection.tsx

export default function PriceSummarySection() {
    const subtotal = 275.70;
    const total = subtotal;
    const installmentPrice = (total / 6).toFixed(2);

    return (
        <div className="secColor p-4 rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">R$ { subtotal.toFixed(2) }</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Frete</span>
                <span className="text-sm font-medium">--</span>
            </div>
            <div className="border-t mt-2 pt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-semibold">R$ { total.toFixed(2) }</span>
                </div>
                <div className="text-sm text-green-500 font-medium">
          ou 6x R$ { installmentPrice } sem juros
                </div>
            </div>
        </div>
    );
}
