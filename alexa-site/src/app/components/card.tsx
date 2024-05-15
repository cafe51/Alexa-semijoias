import Image from 'next/image';
import { ProductType } from '../utils/types';
import Link from 'next/link';

export default function Card({ cardData, productType }: {cardData: ProductType, productType: string}) {

    let render = (<h3>render</h3>);

    if (cardData) {
        render = (
            <>
                <div className='w-full rounded-lg relative h-[150px] overflow-hidden'>
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
        <section className="flex flex-col text-center  w-5/12 items-center justify-between pb-2 gap-2 border-solid border-2 border-pink-100 shadow-pink-200 shadow-lg text-[12px] rounded-lg h-[450px]"
        >
            <Link href={ `/${productType}/${cardData.id}` }>{ render }</Link>
            <button className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'>COMPRE JÁ</button>
        </section>
    );
}
