import Image from 'next/image';
import { CartHistoryType, OrderType } from '../utils/types';

// interface CardOrderProps {
//     pedido: OrderType;
//   }

export default function CardOrder({ pedido } : { pedido: OrderType }) {
    return (
        <div className='flex flex-col items-center justify-center w-full gap-2  p-4  shadow-lg shadowColor rounded-lg '>
            <div className='w-full border-2 border-solid border-pink-100'></div>
            <p>{ pedido.data }</p>
            <div className='relative h-24 flex self-start'>
                { pedido.carrinho.map((item: CartHistoryType, index) => {
                    return (
                        <div
                            key={ index }
                            className={ 'absolute rounded-lg w-24 h-24 overflow-hidden' }
                            style={ { left: index * (80 - (index ** 2.2 <= 80 ? index ** 2.2 : 80)), zIndex: pedido.carrinho.length - index } }
                        >
                            <Image
                                src={ item.image }
                                alt={ `Image ${index + 1}` }
                                fill
                                sizes='96px'
                                className=" object-cover border-2 border-white rounded-2xl "
                            />
                        </div>
                    );

                },
                ) }
            </div>
            <div className='flex w-full justify-between'>
                <p>R$ { pedido.valor.total.toFixed(2) }</p>
                <p>{ pedido.status }</p>
            </div>
           

        </div>
    );

}