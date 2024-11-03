// app/checkout/OrderSummarySection/SummaryCard.tsx
import { CartHistoryType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.png';
import { formatPrice } from '@/app/utils/formatPrice';


export default function SummaryCard({ produto }: { produto: CartHistoryType }) {

    const { quantidade, name, image, value: { price, promotionalPrice } } = produto;

    const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantidade) : (price * quantidade));

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white rounded-lg border-b' >
            <div className='flex gap-4 w-full h-[90px] md:h-[120px] '>
                {
                    <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0 md:h-28 md:w-28'>
                        <Image
                            className='rounded-lg object-cover scale-100'
                            src={ image ? image : blankImage }
                            alt="Foto da peça"
                            fill
                        />
                    </div>
                    // <img src={ image } alt={ name } className="w-20 h-20 object-cover rounded-md mr-4" />
                }
                <div className='rounded-lg relative w-3/4 overflow-hidden text-sm font-bold md:text-xl' >
                    <p >{ name }</p>
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <p className='text-sm text-gray-500 md:text-lg'>
                    <span className='font-bold'>{ quantidade }</span> { quantidade > 1 ? 'unidades' : 'unidade' } por <span className="font-bold">{ precoCheio }</span>
                </p>

            </div>
        </div>
    );
}