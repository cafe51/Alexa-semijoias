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

    const addItemToFirebaseCart = (user: User, carrinho: (ProductCartType & FireBaseDocument)[] | null, product: ProductVariation, quantity: number) => {
        const cartItem = carrinho?.find((item) => item.skuId === product.sku);
        if (!cartItem) {
            addDocument({
                skuId: product.sku,
                productId: product.productId,
                quantidade: quantity,
                userId: user.uid,
            });
        } else if (cartItem.quantidade < product.estoque) {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade += quantity);
        }
    };

    const handleAddToCart = (
        carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
        productData: ProductVariation | null,
        setIsloadingButton: Dispatch<SetStateAction<boolean>>,
        quantity: number = 1,
    ) => {
        try{
            setIsloadingButton(true);
            if(!productData) throw new Error('dados do produto não encontrados');
            if (!user) {
                // Usuário não está logado, salva no localStorage
                addItemToLocalStorageCart(productData, quantity);
                console.warn('user está deslogado!');
            } else {
                // Usuário está logado, salva no firebase
                addItemToFirebaseCart(user, carrinho as (ProductCartType & FireBaseDocument)[], productData, quantity);
            }
        } catch(error){
            console.log('erro ao tentar adicionar ao carrinho', error);
        }
        finally {
            setTimeout(() => {
                setIsloadingButton(false);
            }, 1000);
        }
    
    };

    return { handleAddToCart };
};