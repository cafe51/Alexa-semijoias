// app/checkout/OrderSummarySection/PriceSummarySection.tsx
import { formatPrice } from '@/app/utils/formatPrice';

interface PriceSummarySectionProps {
    subtotalPrice: number | undefined;
    frete: number | undefined;
    couponDiscount?: number | 'freteGratis';  // nova prop para o desconto do cupom
    adminDashboard?: boolean;
}

export default function PriceSummarySection({ subtotalPrice, frete, couponDiscount = 0, adminDashboard = false }: PriceSummarySectionProps) {
    const computedSubtotal = subtotalPrice && subtotalPrice > 0 ? subtotalPrice : 0;
    const couponDiscountIsFreeShipping = !!couponDiscount && (couponDiscount === 'freteGratis');
    const couponDiscountValue = !couponDiscountIsFreeShipping && !!couponDiscount ? couponDiscount : 0;

    const computedFrete: number | 'freteGratis' = couponDiscountIsFreeShipping ? 'freteGratis' : (frete && frete > 0 ? frete : 0);
    const computedFreteIsFreeShipping = (computedFrete === 'freteGratis');
    let total = 0;
    if (computedFreteIsFreeShipping) {
        total = computedSubtotal;
    } else {
        total = computedSubtotal + computedFrete - (couponDiscountIsFreeShipping ? 0 : couponDiscountValue);
    }

    return (
        <div className="flex flex-col secColor p-4 rounded-md shadow-lg gap-2 md:p-6 md:gap-4">
            
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-xl font-bold">Subtotal</span>
                <span className="text-sm font-medium md:text-xl">{ computedSubtotal > 0 ? formatPrice(computedSubtotal) : '--' }</span>
            </div>

            { !couponDiscountIsFreeShipping && couponDiscount > 0 && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm md:text-xl font-bold">Desconto</span>
                    <span className="text-sm font-medium md:text-xl">- { formatPrice(couponDiscountValue) }</span>
                </div>
            ) }

            { couponDiscountIsFreeShipping && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm md:text-xl font-bold">Desconto</span>
                    <span className="text-sm font-medium md:text-xl">Frete Grátis</span>
                </div>
            ) }

            { computedFreteIsFreeShipping && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm md:text-xl font-bold">Frete</span>
                    <span className="text-sm font-medium md:text-xl line-through">{ frete && frete > 0 ? formatPrice(frete) : '' }</span>
                    <span className="text-sm font-medium md:text-xl">FRETE GRATIS</span>

                </div>
            ) }

            {
                !computedFreteIsFreeShipping && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm md:text-xl font-bold">Frete</span>
                        <span className="text-sm font-medium md:text-xl">{ computedFrete ? formatPrice(computedFrete) : '--' }</span>
                    </div>
                )
            }
            
            <div className="border-t mt-2 pt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold md:text-2xl">Total</span>
                    <span className="text-lg font-semibold md:text-2xl">
                        { total > 0 ? formatPrice(total) : '--' }
                    </span>
                </div>
                { !adminDashboard && 
                    <div className="text-sm text-[#D4AF37] font-medium md:text-lg">
                        ou 6x { total > 0 ? formatPrice(total / 6) : '--' } sem juros
                    </div>
                }
            </div>
        </div>
    );
}
