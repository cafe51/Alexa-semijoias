//app/components/Card.tsx

import Image from 'next/image';
import { CartInfoType, ProductType } from '../utils/types';
import Link from 'next/link';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';

export default function Card({ cardData, productType }: { cardData: ProductType, productType: string }) {
    const { addDocument, updateDocumentField } = useCollection<CartInfoType>('carrinhos', null);

    const { user } = useAuthContext();
    const  carrinho = useUserInfo()?.carrinho;

    const handleBuyClick = () => {
        if (!user) {
            console.warn('User not logged in. Cannot add to cart.');
            return;
        }

        const cartItem = carrinho?.find((item) => item.productId === cardData.id);

        if (!cartItem) {
            addDocument({
                productId: cardData.id,
                quantidade: 1,
                userId: user.uid,
            });
        } else {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade + 1);
        }
    };


    let render = (<h3>render</h3>);

    if (cardData) {
        render = (
            <section className='w-full'>
                <div className='w-full rounded-lg relative h-[200px] overflow-hidden bg-yellow-300'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ cardData.image[0] }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <h3 className='p-2 w-full'>{ cardData.nome }</h3>
                <div className=''>
                    <p className='font-bold text-xl'>R$ { cardData.preco } </p>
                    <p>em até 6x de</p>
                    <p className='font-bold text-xl'>R$ { (cardData.preco/6).toFixed(2) } </p>
                    <p> sem juros</p>
                </div>
            </section>
        );
    } else {
        render = (<h3>Carregando...</h3>);
    }

    return (
        <section className="flex flex-col text-center w-[160px] items-center justify-between pb-2 gap-2 shadowColor shadow-lg text-[12px] rounded-lg h-[450px] bg-white"
        >
            <Link href={ `/${productType}/${cardData.id}` } className='w-full'>{ render }</Link>
            <button
                onClick= { handleBuyClick }
                className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'>
                    COMPRAR
            </button>
        </section>
    );
}
