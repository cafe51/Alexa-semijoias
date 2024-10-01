// app/checkout/OrderSummarySection/SummaryCard.tsx
import { CartHistoryType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.jpg';
import { formatPrice } from '@/app/utils/formatPrice';


export default function SummaryCard({ produto }: { produto: CartHistoryType }) {

    const { quantidade, name, image, value: { price, promotionalPrice } } = produto;

    const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantidade) : (price * quantidade));

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white rounded-lg border-b' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                    <Image
                        className='rounded-lg object-cover scale-100'
                        src={ image ? image : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='rounded-lg relative w-3/4 overflow-hidden text-sm font-bold' >
                    <p >{ name }</p>
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <p className='text-sm text-gray-500'>
                    <span className='font-bold'>{ quantidade }</span> { quantidade > 1 ? 'unidades' : 'unidade' } por <span className="font-bold">{ precoCheio }</span>
                </p>

            </div>
        </div>
    );
}