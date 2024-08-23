// app/checkout/PaymentSection/PaymentSection.tsx
import LargeButton from '@/app/components/LargeButton';
import ChoosePaymentOptionSection from './ChoosePaymentOptionSection';
import CreditPaymentSection from './CreditPaymentSection';
import PaymentSectionPending from './PaymentSectionPending';
import PixPaymentSection from './PixPaymentSection';
import { FireBaseDocument, OrderType, ProductBundleType, ProductCartType, UseCheckoutStateType } from '@/app/utils/types';
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
    const { addDocument: createNewOrder  } = useCollection<OrderType>('pedidos');
    const { updateDocumentField: updateProductBundleDocument, getDocumentById: getProductBundleDocumentById  } = useCollection<ProductBundleType>('products');
    const { deleteDocument: deleteCartItemFromDb } = useCollection<ProductCartType>('carrinhos');


    const { editingAddressMode, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;

    const updateTheProductDocumentStock = async(productId: string, skuId: string, quantity: number) => {
        try {
            // 1. Recuperar o documento do produto
            const product = await getProductBundleDocumentById(productId);
            console.log('productId', productId);
            if (!product.exist) throw new Error('Product not found');
    
            // 2. Encontrar a variação específica
            const variationIndex = product.productVariations.findIndex(v => v.sku === skuId);
            if (variationIndex === -1) throw new Error('Product variation not found');
    
            // 3. Atualizar o estoque da variação e o estoque total
            const updatedVariations = [...product.productVariations];
            updatedVariations[variationIndex].estoque -= quantity;
    
            const updatedStockTotal = product.estoqueTotal - quantity;
    
            // 4. Enviar as atualizações para o Firebase
            await updateProductBundleDocument(productId, 'productVariations', updatedVariations);
            await updateProductBundleDocument(productId, 'estoqueTotal', updatedStockTotal);
    
            console.log('Estoque atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    };

    const finishPayment = async() => {
        const { address, deliveryOption, selectedDeliveryOption, selectedPaymentOption } = state;
        const deliveryPrice = deliveryOption?.price || 0;
        // const cartPrice = carrinho?.map((items) => (Number(items.quantidade) * (items.preco))).reduce((a, b) => a + b, 0) || 0;
        const totalQuantity = carrinho?.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0) || 0;
        const currentDate = new Date();
        const formattedDate = formatDateToCustomString(currentDate);

        if(userInfo && carrinho && address && deliveryOption && selectedDeliveryOption && selectedPaymentOption) {
            const newOrder: OrderType = {
                endereco: address,
                cartSnapShot: carrinho.map(({ image, name, value: { price }, productId, quantidade, skuId, barcode, categories, customProperties }) => (
                    { skuId, name, barcode, categories, productId, quantidade, image, price, customProperties }
                )),
                status: 'pendente',
                userId: userInfo.id,
                valor: {
                    frete: deliveryPrice,
                    soma: cartPrice || 0,
                    total: (cartPrice || 0) + deliveryPrice,
                },
                totalQuantity,
                paymentOption: selectedPaymentOption,
                deliveryOption: selectedDeliveryOption,
                data: formattedDate,
            };

            console.log(newOrder);
            createNewOrder(newOrder);

            await Promise.all(carrinho.map((item) => {
                updateTheProductDocumentStock(item.productId, item.skuId, item.quantidade);
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