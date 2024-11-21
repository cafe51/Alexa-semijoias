import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useCollection } from '@/app/hooks/useCollection';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { FireBaseDocument, OrderType, ProductBundleType, ProductCartType } from '@/app/utils/types';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cancelPayment } from '@/app/utils/apiCall';

interface TryNewOrderButtonProps {
    pedidoState: OrderType & FireBaseDocument;
    setLoadingState: Dispatch<SetStateAction<boolean>>;
}

export default function TryNewOrderButton({ pedidoState: { cartSnapShot, id }, setLoadingState }: TryNewOrderButtonProps) {
    const router = useRouter();
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart();
    const { getDocumentById } = useCollection<ProductBundleType>('products');
    const { deleteDocument: deleteCartItemFromDb } = useCollection<ProductCartType>('carrinhos');
    const [carrinhoState, setCarrinhoState] = useState<(ProductCartType & FireBaseDocument)[] | ProductCartType[] | null>(carrinho);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCarrinhoState(carrinho);
    }, [carrinho]);

    const deleteCartItems = async(): Promise<void> => {
        console.log('Iniciando deleteCartItems');
        if (carrinhoState && carrinhoState.length > 0) {
            for (const item of carrinhoState) {
                const { id } = item as ProductCartType & FireBaseDocument;
                await deleteCartItemFromDb(id);
            }
        }
        setCarrinhoState([]);
        console.log('Carrinho esvaziado');
    };

    const addItemsToCart = async(): Promise<void> => {
        console.log('*************************************');
        console.log('Estado do carrinho antes de adicionar:', carrinhoState);

        const updatedCarrinho: (ProductCartType & FireBaseDocument)[] = [];

        for (const cartSnapshotItem of cartSnapShot) {
            try {
                const { productId } = cartSnapshotItem as ProductCartType & FireBaseDocument;
                const productData = await getDocumentById(productId);
                const productVariation = productData.productVariations.find(item => item.sku === cartSnapshotItem.skuId) || null;

                if (productVariation) {
                    setTimeout(async() => {
                        await handleAddToCart(updatedCarrinho, productVariation, setLoadingState, cartSnapshotItem.quantidade);
                        updatedCarrinho.push({
                            ...cartSnapshotItem,
                            skuId: productVariation.sku,
                            productId: productVariation.productId,
                            quantidade: cartSnapshotItem.quantidade,
                        } as ProductCartType & FireBaseDocument);
                        setTimeout(() => router.push('/carrinho'), 0);
                    }, productVariation.estoque === 0 ? 5000 : 0);
                } else {
                    setLoadingState(false);
                    console.error('Variação do produto não encontrada:', cartSnapshotItem);
                }
            } catch (error) {
                setLoadingState(false);
                console.error('Erro ao adicionar item ao carrinho:', error);
                throw error;
            }
        }

        setCarrinhoState(updatedCarrinho);
        console.log('Itens adicionados ao carrinho. Novo estado:', updatedCarrinho);
    };

    const handleTryNewOrder = async(): Promise<void> => {
        console.log('Iniciando handleTryNewOrder');
        console.log('Estado do carrinho antes de esvaziar:', carrinhoState);
        
        setLoadingState(true);
        setError(null);

        try {
            await cancelPayment(id);
            await deleteCartItems();
            console.log('deleteCartItems concluído');
            await addItemsToCart();
            console.log('addItemsToCart concluído');
        } catch (error) {
            console.error('Erro ao processar o novo pedido:', error);
            setError('Ocorreu um erro ao processar o pedido. Por favor, tente novamente.');
        } finally {
            // setLoadingState(false);
        }


    };

    return (
        <>
            <Button
                className="bg-[#D4AF37] text-white hover:bg-[#C48B9F] flex-1" onClick={ handleTryNewOrder }
                disabled={ false }
            >
                <RefreshCw className="mr-2 h-4 w-4" />
        Refazer
            </Button>
            { error && <p style={ { color: 'red', marginTop: '10px' } }>{ error }</p> }
        </>
    );
}
