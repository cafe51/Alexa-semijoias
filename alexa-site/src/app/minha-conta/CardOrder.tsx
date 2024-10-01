//app/minha-conta/CardOrder.tsx
import Image from 'next/image';
import {  FireBaseDocument, OrderType } from '../utils/types';
import { formatPrice } from '../utils/formatPrice';
import Link from 'next/link';

function CardImages({ pedido }: { pedido: OrderType & FireBaseDocument }) {
    return(
        <div className='relative h-24 flex self-start'>
            { pedido.cartSnapShot.map((item, index) => {
                return (
                    <div
                        key={ index }
                        className={ 'absolute rounded-lg w-24 h-24 overflow-hidden' }
                        style={ { left: index * (80 - (index ** 2.4 <= 70 ? index ** 2.4 : 80)), zIndex: pedido.cartSnapShot.length - index } }
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
    );
}

interface CardOrderProps {
    pedido: OrderType & FireBaseDocument
}


export default function CardOrder({ pedido }: CardOrderProps) {
    return (
        <div className='flex flex-col bg-white text-sm w-full gap-2 p-4  shadow-lg shadowColor rounded-lg ' >
            <div className="mb-2 text-orange-500 font-semibold">
                { pedido.status }
            </div>
            <div className="font-bold">
                <span className="">Nº </span>
                { pedido.id }
            </div>
            <div className="font-bold">
                { pedido.updatedAt.toDate().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) }
            </div>
            <div className="text-gray-500">
                { `${pedido.endereco.logradouro}, ${pedido.endereco.numero} - ${pedido.endereco.localidade}` }
            </div>
            <CardImages pedido={ pedido }/>
            <div className="">
                <span className="text-gray-500">{ pedido.totalQuantity } unidades</span>
            </div>
            <div className="font-bold">
                Total { formatPrice(pedido.valor.total) }
            </div>
            <div className="mb-4 text-green-500">
                { pedido.paymentOption } { formatPrice(pedido.valor.total) }
            </div>
            <Link href={ `/pedido/${pedido.id}` } className="flex justify-center">
                <button className="bg-green-500 text-white py-2 px-4 rounded">
                    Ver pedido
                </button>
            </Link>
        </div>
    );

}
