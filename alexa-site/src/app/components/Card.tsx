//app/components/Card.tsx

import Image from 'next/image';
import { CartInfoType, ProductType } from '../utils/types';
import Link from 'next/link';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCollection } from '../hooks/useCollection';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import formatPrice from '../utils/formatPrice';

export default function Card({ cardData, productType }: { cardData: ProductType | null, productType: string }) {
    const { addItemToLocalStorageCart } = useLocalStorage();
    const { addDocument, updateDocumentField } = useCollection('carrinho');
    const { user } = useAuthContext();
    const carrinho = useUserInfo()?.carrinho;

    if (!cardData) return <h3>Carregando...</h3>;
    
    const isDisabled = () => {
        const cartItem = carrinho?.find((item) => item.productId === cardData.id);
        return cartItem ? cartItem.quantidade >= cardData.estoque : false;
    };

    const addItemToFirebaseCart = (user: User, carrinho: (CartInfoType & DocumentData)[] | null, product: ProductType) => {
        const cartItem = carrinho?.find((item) => item.productId === product.id);
        if (!cartItem) {
            addDocument({
                productId: product.id,
                quantidade: 1,
                userId: user.uid,
            });
        } else if (cartItem.quantidade < product.estoque) {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade += 1);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            // Usuário não está logado, salva no localStorage
            addItemToLocalStorageCart(cardData);
            console.warn('user está deslogado!');
        } else {
            // Usuário está logado, salva no firebase
            addItemToFirebaseCart(user, carrinho, cardData);
        }
        
    };
    
    return (
        <div className='flex flex-col text-center w-[160px] justify-between content-between place-content-between gap-2 shadowColor shadow-lg text-[12px] rounded-lg bg-white'>

            <section className='flex flex-col w-full'>
                <Link href={ `/${productType}/${cardData.id}` } className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg object-cover scale-125'
                        src={ cardData.image[0] }
                        alt="Foto da peça"
                        fill
                    />
                </Link>

                <div>
                    <h3 className='p-2 w-full'>{ cardData.nome }</h3>
                </div>

            </section>

            <section className="flex flex-col w-full p-4 ">
                <div className='p-2 w-full bg-yellow-200'>
                    <h3 >{ cardData.id }</h3>
                </div>

                <div>
                    <p className='font-bold text-xl'>{ formatPrice(cardData.preco) }</p>
                    <p>em até 6x de</p>
                    <p className='font-bold text-xl'>{ formatPrice(cardData.preco / 6) }</p>
                    <p> sem juros</p>
                </div>
                <button
                    onClick={ handleAddToCart }
                    disabled={ isDisabled() }
                    className='rounded-full bg-green-500 p-4 px-6 font-bold text-white disabled:bg-green-200'>
          COMPRAR
                </button>
            </section>

        </div>
    );
}