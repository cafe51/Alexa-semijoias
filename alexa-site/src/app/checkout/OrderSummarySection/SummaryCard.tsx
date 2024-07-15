// app/checkout/OrderSummarySection/SummaryCard.tsx

import { ProductCartType } from '@/app/utils/types';
import Image from 'next/image';

export default function SummaryCard({ produto }: { produto: ProductCartType }) {

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white rounded-lg border-b' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-[75px] w-[75px] overflow-hidden'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ produto.image }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='rounded-lg relative w-3/4 overflow-hidden text-sm' >
                    <p >{ produto.nome }</p>
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <p className='text-sm'>
                    <span>{ produto.quantidade }</span> { produto.quantidade > 1 ? 'unidades' : 'unidade' } por <span className="font-semibold">R$ { (produto.preco * produto.quantidade).toFixed(2) }</span>
                </p>

            </div>
        </div>
    );
}