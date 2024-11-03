// app/checkout/OrderSummarySection/PriceSummarySection.tsx
import { formatPrice } from '@/app/utils/formatPrice';

interface PriceSummarySectionProps {
    subtotalPrice: number | undefined;
    frete: number | undefined;
    adminDashboard?: boolean;
}


export default function PriceSummarySection({ subtotalPrice, frete, adminDashboard=false }: PriceSummarySectionProps) {
    return (
        <div className="flex flex-col secColor p-4 rounded-md shadow-lg gap-2 md:p-6 md:gap-4">
            
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-xl font-bold">Subtotal</span>
                <span className="text-sm font-medium md:text-xl">R$ { subtotalPrice && subtotalPrice > 0 ? formatPrice(subtotalPrice) : '--' }</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-xl font-bold">Frete</span>
                <span className="text-sm font-medium md:text-xl">{ frete ? formatPrice(frete) : '--' }</span>
            </div>
            <div className="border-t mt-2 pt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold md:text-2xl">Total</span>
                    <span className="text-lg font-semibold md:text-2xl">
                        {
                            subtotalPrice && subtotalPrice > 0 
                                ?
                                formatPrice(subtotalPrice + (frete ? frete : 0))
                                :
                                '--'
                        }
                    </span>
                </div>
                { !adminDashboard && 
                    <div className="text-sm text-[#D4AF37] font-medium md:text-lg">
                ou 6x {
                            subtotalPrice 
                                ?
                                formatPrice((subtotalPrice + (frete ? frete : 0)) / 6)
                                :
                                '--'
                        } sem juros
                    </div>
                }
            </div>
        </div>
    );
}
