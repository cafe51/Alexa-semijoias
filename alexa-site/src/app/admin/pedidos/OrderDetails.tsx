import AccountSectionFilled from '@/app/checkout/AccountSection/AccountSectionFilled';
import AddressSectionFilled from '@/app/checkout/AddressSection/AddressSectionFilled';
import PriceSummarySection from '@/app/checkout/OrderSummarySection/PriceSummarySection';
import SummaryCard from '@/app/checkout/OrderSummarySection/SummaryCard';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';

interface OrderDetailsProps {
    pedido: OrderType & FireBaseDocument;
    user: UserType & FireBaseDocument;
}

export default function OrderDetails({ pedido, user: { cpf, email, nome, tel } }: OrderDetailsProps) {
    return (
        <div className="flex flex-col gap-2 text-sm ">
            <div className='w-full p-2 text-center'>
                <h2>{ pedido.status }</h2>
            </div>
            <AccountSectionFilled
                cpf={ cpf }
                email={ email }
                nome={ nome }
                telefone={ tel }
                adminDashboard
            />

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
    );
}