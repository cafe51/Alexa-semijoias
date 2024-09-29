// app/checkout/OrderSummarySection/PriceSummarySection.tsx
import { formatPrice } from '@/app/utils/formatPrice';

interface PriceSummarySectionProps {
    subtotalPrice: number | undefined;
    frete: number | undefined;
    adminDashboard?: boolean;
}


export default function PriceSummarySection({ subtotalPrice, frete, adminDashboard=false }: PriceSummarySectionProps) {
    return (
        <div className="flex flex-col secColor p-4 rounded-md shadow-lg gap-2">
            
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">R$ { subtotalPrice ? formatPrice(subtotalPrice) : '--' }</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Frete</span>
                <span className="text-sm font-medium">{ frete ? formatPrice(frete) : '--' }</span>
            </div>
            <div className="border-t mt-2 pt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                        {
                            subtotalPrice 
                                ?
                                formatPrice(subtotalPrice + (frete ? frete : 0))
                                :
                                '--'
                        }
                    </span>
                </div>
                { !adminDashboard && 
                    <div className="text-sm text-green-500 font-medium">
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
