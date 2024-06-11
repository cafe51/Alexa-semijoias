import Image from 'next/image';
import { ProductType } from '../utils/types';
import Link from 'next/link';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Card({ cardData, productType }: {cardData: ProductType, productType: string}) {
    const { addDocument, updateDocumentField } = useCollection('carrinhos', null);

    const { user } = useAuthContext();

    const handleBuyClick = () => {
        if (!user) {
            console.warn('User not logged in. Cannot add to cart.');
            return;
        }

        const cartItem = user.carrinho?.find((item: any) => item.productId === cardData.id);

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
            <>
                <div className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ cardData.image[0] }
                        alt="Foto da peça"
                        fill
                    />

         
          
                </div>
                <h3 className='p-2'>{ cardData.nome }</h3>
                <div className=''>
                    <p className='font-bold text-xl'>R$ { cardData.preco } </p>
                    <p>em até 6x de</p>
                    <p className='font-bold text-xl'>R$ { (cardData.preco/6).toFixed(2) } </p>
                    <p> sem juros</p>
                </div>


            </>
        );
    } else {
        render = (<h3>Carregando...</h3>);
    }


    return (
        <section className="flex flex-col text-center w-[160px] items-center justify-between pb-2 gap-2 shadowColor shadow-lg text-[12px] rounded-lg h-[450px] bg-white"
        >
            <Link href={ `/${productType}/${cardData.id}` }>{ render }</Link>
            <button
                onClick= { handleBuyClick }
                className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'>
                    COMPRAR
            </button>
        </section>
    );
}
