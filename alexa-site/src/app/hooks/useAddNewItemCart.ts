// app/hooks/useUpdateCard.ts
import { User } from 'firebase/auth';
import { CartInfoType, FireBaseDocument, ProductCartType, ProductVariation } from '../utils/types';
import { useLocalStorage } from './useLocalStorage';
import { useCollection } from './useCollection';
import { useAuthContext } from './useAuthContext';
import { Dispatch, SetStateAction } from 'react';

export const useAddNewItemCart = () => {
    const { addItemToLocalStorageCart } = useLocalStorage();
    const { addDocument, updateDocumentField } = useCollection<CartInfoType>('carrinhos');
    const { user } = useAuthContext();

    const addItemToFirebaseCart = async(user: User, carrinho: (ProductCartType & FireBaseDocument)[] | null, product: ProductVariation, quantity: number) => {
        try {
            const cartItem = carrinho?.find((item) => item.skuId === product.sku);
            if (!cartItem) {
                await addDocument({
                    skuId: product.sku,
                    productId: product.productId,
                    quantidade: quantity,
                    userId: user.uid,
                });
            } else if (cartItem.quantidade < product.estoque) {
                await updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade + quantity);
            }
            console.log('Item adicionado/atualizado no Firebase com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar/atualizar item no Firebase:', error);
            throw error;
        }
    };

    const handleAddToCart = async(
        carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
        productData: ProductVariation | null,
        setIsloadingButton: Dispatch<SetStateAction<boolean>>,
        quantity: number = 1,
    ): Promise<void> => {
        try {
            setIsloadingButton(true);
            if (!productData) throw new Error('Dados do produto não encontrados');
            
            if (!user) {
                // Usuário não está logado, salva no localStorage
                addItemToLocalStorageCart(productData, quantity);
                console.log('Item adicionado ao localStorage (usuário deslogado)');
            } else {
                // Usuário está logado, salva no firebase
                await addItemToFirebaseCart(user, carrinho as (ProductCartType & FireBaseDocument)[], productData, quantity);
            }
            console.log('Item adicionado ao carrinho com sucesso');
        } catch (error) {
            console.error('Erro ao tentar adicionar ao carrinho:', error);
            throw error;
        } finally {
            setTimeout(() => {
                setIsloadingButton(false);
            }, 1000);
        }
    };

    return { handleAddToCart };
};