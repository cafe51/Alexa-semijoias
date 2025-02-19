// app/checkout/OrderSummarySection/SummaryCard.tsx
import { CartHistoryType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.png';
import toTitleCase from '@/app/utils/toTitleCase';
import CartCardPrice from '@/app/carrinho/CartCardPrice';


export default function SummaryCard({ produto }: { produto: CartHistoryType }) {

    const { quantidade, name, image, value } = produto;

    // const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantidade) : (price * quantidade));

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white rounded-lg border-b' >
            <div className='flex gap-4 w-full h-[90px] md:h-[120px] '>
                {
                    <div className='rounded-lg relative h-24 w-24 overflow-hidden flex-shrink-0 md:h-32 md:w-32'>
                        <Image
                            className='rounded-lg object-cover scale-100'
                            src={ image ? image : blankImage }
                            alt="Foto da peça"
                            sizes="200px"
                            fill
                        />
                    </div>
                    // <img src={ image } alt={ name } className="w-20 h-20 object-cover rounded-md mr-4" />
                }
                <div className='rounded-lg relative w-3/4 overflow-hidden font-bold md:text-xl' >
                    <p >{ toTitleCase(name) }</p>
                </div>
            </div>
            <div className="flex justify-between items-center w-full text-gray-500 md:text-lg">
                <div className='flex gap-2'>
                    <p className='font-bold'>{ quantidade }</p>
                    <p>{ quantidade > 1 ? 'unidades' : 'unidade' }</p>
                </div>
                <CartCardPrice quantidade={ quantidade } value={ value } />
            </div>
        </div>
    );
}