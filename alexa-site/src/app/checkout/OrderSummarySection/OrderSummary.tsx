// app/checkout/OrderSummarySection/OrderSummary.tsx
import { PiXBold } from 'react-icons/pi';
import { ProductCartType } from '../../utils/types';
import PriceSummarySection from './PriceSummarySection';
import SummaryCard from './SummaryCard';
import Link from 'next/link';

interface OrderSummaryProps {
    handleShowFullOrderSummary: (option: boolean) => void;
    carrinho: ProductCartType[] | null;
    subtotalPrice: number | undefined;
    frete: number | undefined;
    couponDiscount: number | 'freteGratis';
}

export default function OrderSummary({ handleShowFullOrderSummary, carrinho, subtotalPrice, frete, couponDiscount = 0 }: OrderSummaryProps) {
    if (!carrinho || carrinho.length === 0) return <p>Loading...</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full max-h-screen relative overflow-hidden">
                <div className="flex justify-between mb-4">
                    <h1 className="text-lg font-bold">Resumo</h1>
                    <button
                        className="px-2 rounded-md bg-gray-200"
                        onClick={ () => handleShowFullOrderSummary(false) }
                    >
                        <PiXBold />
                    </button>
                </div>
                <div className="overflow-auto max-h-[calc(100vh-200px)]">
                    <PriceSummarySection
                        frete={ frete }
                        subtotalPrice={ subtotalPrice }
                        couponDiscount={ couponDiscount }
                    />
                    <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                        <div className="flex justify-between w-full p-4">
                            <h2 className="text-base text-center self-center">Produtos</h2>
                            <Link href={ '/carrinho' }>
                                <h2 className="text-base text-center self-center text-blue-400">Editar produtos</h2>
                            </Link>
                        </div>
                        { carrinho ? carrinho.map((produto: ProductCartType) => {
                            if (produto && produto.quantidade && produto.quantidade > 0) {
                                return <SummaryCard key={ produto.skuId } produto={ produto } />;
                            } else return null;
                        }) : <span>Loading...</span> }
                    </section>
                </div>
            </div>
        </div>
    );
}
