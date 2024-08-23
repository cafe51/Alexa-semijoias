//app/minha-conta/FullOrderModal.tsx
import { PiXBold } from 'react-icons/pi';
import { Dispatch, SetStateAction } from 'react';
import { FireBaseDocument, OrderType } from '../utils/types';
import SummaryCard from '../checkout/OrderSummarySection/SummaryCard';
import PriceSummarySection from '../checkout/OrderSummarySection/PriceSummarySection';
import AddressSectionFilled from '../checkout/AddressSection/AddressSectionFilled';

interface FullOrderModalProps {
    pedido: OrderType & FireBaseDocument;
    setShowFullOrderModal: Dispatch<SetStateAction<{
        pedido?: OrderType & FireBaseDocument;
    }>>
}

export default function FullOrderModal({ pedido, setShowFullOrderModal }: FullOrderModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-xs w-full max-h-screen relative overflow-hidden">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Resumo</h3>
                    <button
                        className="px-2 rounded-md bg-gray-200"
                        onClick={ () => setShowFullOrderModal({
                            pedido: undefined,
                        }) }
                    >
                        <PiXBold />
                    </button>
                </div>
                <div className="flex flex-col gap-2 text-sm overflow-auto max-h-[calc(100vh-200px)]">
                    <AddressSectionFilled address={ pedido.endereco } />

                    <PriceSummarySection
                        frete={ pedido.valor.frete }
                        subtotalPrice={ pedido.valor.soma }
                    />
                    <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                        { pedido.cartSnapShot && pedido.cartSnapShot.length > 0 ? pedido.cartSnapShot.map((produto) => {
                            if (produto && produto.quantidade && produto.quantidade > 0) {
                                return <SummaryCard key={ produto.skuId } produto={ produto } />;
                            } else return false;
                        }) : <span>Loading...</span> }
                    </section>
                </div>
            </div>
        </div>
    );
}