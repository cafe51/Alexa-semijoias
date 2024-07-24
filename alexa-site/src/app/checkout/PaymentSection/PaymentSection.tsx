// app/checkout/PaymentSection/PaymentSection.tsx
import LargeButton from '@/app/components/LargeButton';
import ChoosePaymentOptionSection from './ChoosePaymentOptionSection';
import CreditPaymentSection from './CreditPaymentSection';
import PaymentSectionPending from './PaymentSectionPending';
import PixPaymentSection from './PixPaymentSection';
import { OrderType, UseCheckoutStateType } from '@/app/utils/types';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { useCollection } from '@/app/hooks/useCollection';
import { formatDateToCustomString } from '@/app/utils/formatDateToCustomString';

interface PaymentSectionProps {
    state: UseCheckoutStateType;
    cartPrice: number;
    handleSelectedPaymentOption: (paymentOption: string | null) => void;
}

export default function PaymentSection({ cartPrice, state, handleSelectedPaymentOption }: PaymentSectionProps) {
    const { userInfo, carrinho } = useUserInfo();
    const { addDocument  } = useCollection<OrderType>('pedidos');
    const { updateDocumentField  } = useCollection('produtos');
    const { deleteDocument: deleteCartItemFromDb } = useCollection('carrinhos');


    const { editingAddressMode, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;

    const finishPayment = async() => {
        const { address, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;
        const deliveryPrice = deliveryOption?.price || 0;
        const cartPrice = carrinho?.map((items) => (Number(items.quantidade) * (items.preco))).reduce((a, b) => a + b, 0) || 0;
        const totalQuantity = carrinho?.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0) || 0;
        const currentDate = new Date();
        const formattedDate = formatDateToCustomString(currentDate);

        if(userInfo && carrinho && address && deliveryOption && selectedDeliveryOption && selectedPaymentOption) {
            const newOrder = {
                endereco: address,
                cartSnapShot: carrinho.map(({ image, nome, categoria, preco, productId, quantidade, id }) => ({ categoria: categoria, image, nome, preco, productId, quantidade, id })),
                status: 'pendente',
                userId: userInfo.userId,
                valor: {
                    frete: deliveryPrice,
                    soma: cartPrice,
                    total: cartPrice + deliveryPrice,
                },
                totalQuantity,
                paymentOption: selectedPaymentOption,
                deliveryOption: selectedDeliveryOption,
                data: formattedDate,
            };
            addDocument(newOrder);

            await Promise.all(carrinho.map(item => updateDocumentField(item.productId, 'estoque', item.estoque - item.quantidade)));
            await Promise.all(carrinho.map(item => deleteCartItemFromDb(item.id)));

        } else {
            console.error('Erro ao acessar dados do usuário ou do carrinho');
        }
    }; 

    if (editingAddressMode || !(selectedDeliveryOption && deliveryOption)) return <PaymentSectionPending />;

    const renderPaymentSection = () => {
        if (!selectedPaymentOption) {
            return (
                <ChoosePaymentOptionSection
                    selectedPaymentOption={ selectedPaymentOption }
                    handleSelectedPaymentOption={ handleSelectedPaymentOption }
                    totalPrice={ cartPrice + ((deliveryOption?.price) ? deliveryOption?.price : 0) }
                />

            );
        }

        if (selectedPaymentOption === 'Cartão de Crédito') {
            return (
                <CreditPaymentSection
                    handleSelectedPaymentOption={ handleSelectedPaymentOption }
                    totalPrice={ cartPrice + ((deliveryOption?.price) ? deliveryOption?.price : 0) }
                />

            );
        } 
        if (selectedPaymentOption === 'Pix') {
            return (
                <PixPaymentSection handleSelectedPaymentOption={ handleSelectedPaymentOption }/>
            );
        } 
    };

    return (
        <section className="border p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full">
            { renderPaymentSection() }
            <LargeButton color='green' loadingButton={ false } onClick={ finishPayment }>
                Finalizar Compra
            </LargeButton>
        </section>
    );
}