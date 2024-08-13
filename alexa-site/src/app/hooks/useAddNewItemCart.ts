// app/hooks/useUpdateCard.ts
import { User } from 'firebase/auth';
import { CartInfoType, ProductVariation } from '../utils/types';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';
import { useCollection } from './useCollection';
import { useAuthContext } from './useAuthContext';
import { Dispatch, SetStateAction } from 'react';

export const useAddNewItemCart = () => {
    const { addItemToLocalStorageCart } = useLocalStorage();
    const { addDocument, updateDocumentField } = useCollection<CartInfoType>('carrinhos');
    const { user } = useAuthContext();

    const addItemToFirebaseCart = (user: User, carrinho: (CartInfoType & WithFieldValue<DocumentData>)[] | null, product: ProductVariation & WithFieldValue<DocumentData>) => {
        const cartItem = carrinho?.find((item) => item.skuId === product.sku);
        console.log('carrinho', carrinho);
        if (!cartItem) {
            addDocument({
                skuId: product.sku,
                productId: product.productId,
                quantidade: 1,
                userId: user.uid,
            });
        } else if (cartItem.quantidade < product.estoque) {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade += 1);
        }
    };

    const handleAddToCart = (
        carrinho: (CartInfoType & WithFieldValue<DocumentData>)[] | null,
        productData: ProductVariation | null,
        setIsloadingButton: Dispatch<SetStateAction<boolean>>,
    ) => {
        try{
            setIsloadingButton(true);
            if(!productData) throw new Error('dados do produto não encontrados');
            if (!user) {
                // Usuário não está logado, salva no localStorage
                addItemToLocalStorageCart(productData);
                console.warn('user está deslogado!');
            } else {
                // Usuário está logado, salva no firebase
                addItemToFirebaseCart(user, carrinho, productData);
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