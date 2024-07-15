// app/checkout/OrderSummarySection/OrderSummary.tsx

import { PiXBold } from 'react-icons/pi';
import { useUserInfo } from '../../hooks/useUserInfo';
import { ProductCartType } from '../../utils/types';
import PriceSummarySection from './PriceSummarySection';
import SummaryCard from './SummaryCard';
import Link from 'next/link';

interface OrderSummaryProps {
    setShowFullOrderSummary: (option: boolean) => void;
}

export default function OrderSummary({ setShowFullOrderSummary }: OrderSummaryProps) {
    const { carrinho } = useUserInfo();

    console.log('CARRINHO', carrinho);

    if (!carrinho || carrinho.length < 0) return <p>Loading...</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-xs w-full max-h-screen relative overflow-hidden">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Resumo</h3>
                    <button
                        className="px-2 rounded-md bg-gray-200"
                        onClick={ () => setShowFullOrderSummary(false) }
                    >
                        <PiXBold />
                    </button>
                </div>
                <div className="overflow-auto max-h-[calc(100vh-200px)]">
                    <PriceSummarySection />
                    <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                        <div className="flex justify-between w-full p-4">
                            <h3 className="text-center self-center">Produtos</h3>
                            <Link href={ '/carrinho' }><h3 className="text-center text-sm self-center text-blue-400">Editar produtos</h3></Link>
                        </div>
                        { carrinho ? carrinho.map((produto: ProductCartType) => {
                            if (produto && produto.quantidade && produto.quantidade > 0) {
                                return <SummaryCard key={ produto.id } produto={ produto } />;
                            } else return false;
                        }) : <span>Loading...</span> }
                    </section>
                </div>
            </div>
        </div>
    );
}
