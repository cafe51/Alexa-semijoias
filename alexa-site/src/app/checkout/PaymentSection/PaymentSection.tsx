// app/checkout/PaymentSection/PaymentSection.tsx
import LargeButton from '@/app/components/LargeButton';
import ChoosePaymentOptionSection from './ChoosePaymentOptionSection';
import CreditPaymentSection from './CreditPaymentSection';
import PaymentSectionPending from './PaymentSectionPending';
import PixPaymentSection from './PixPaymentSection';
import { FireBaseDocument, OrderType, ProductCartType, UseCheckoutStateType } from '@/app/utils/types';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { useCollection } from '@/app/hooks/useCollection';
import { Timestamp } from 'firebase/firestore';
import { useManageProductStock } from '@/app/hooks/useManageProductStock';

interface PaymentSectionProps {
    state: UseCheckoutStateType;
    cartPrice: number;
    handleSelectedPaymentOption: (paymentOption: string | null) => void;
}

export default function PaymentSection({ cartPrice, state, handleSelectedPaymentOption }: PaymentSectionProps) {
    const { userInfo, carrinho } = useUserInfo();
    const { addDocument: createNewOrder  } = useCollection<OrderType>('pedidos');
    const { deleteDocument: deleteCartItemFromDb } = useCollection<ProductCartType>('carrinhos');
    const { updateTheProductDocumentStock } = useManageProductStock();

    const { editingAddressMode, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;

    const finishPayment = async() => {
        const { address, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;
        const deliveryPrice = deliveryOption?.price || 0;
        // const cartPrice = carrinho?.map((items) => (Number(items.quantidade) * (items.preco))).reduce((a, b) => a + b, 0) || 0;
        const totalQuantity = carrinho?.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0) || 0;

        if(userInfo && carrinho && address && deliveryOption && selectedDeliveryOption && selectedPaymentOption) {
            const newOrder: OrderType = {
                endereco: address,
                // cartSnapShot: carrinho.map(({ image, name, value, productId, quantidade, skuId, barcode, categories, customProperties }) => (
                //     { skuId, name, barcode, categories, productId, quantidade, image, value, customProperties }
                // )),
                cartSnapShot: carrinho,
                status: 'aguardando pagamento',
                userId: userInfo.id,
                valor: {
                    frete: deliveryPrice,
                    soma: cartPrice || 0,
                    total: (cartPrice || 0) + deliveryPrice,
                },
                totalQuantity,
                paymentOption: selectedPaymentOption,
                deliveryOption: selectedDeliveryOption,
                date: Timestamp.now(),
            };

            console.log(newOrder);
            createNewOrder(newOrder);

            await Promise.all(carrinho.map((item) => {
                updateTheProductDocumentStock(item.productId, item.skuId, item.quantidade, '-');
            }));

            await Promise.all(carrinho.map((item) => {
                const { id } = item as ProductCartType & FireBaseDocument;
                deleteCartItemFromDb(id);
            }));

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