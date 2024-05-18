import Image from 'next/image';
import { ProductType } from '../utils/types';

export default function CartItem({ produto }: {produto: ProductType}) {
    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 border-solid border-2 border-x-0 borderColor ' >
            <div className='flex gap-4 w-full h-full '>
                <div className='rounded-lg relative h-[75px] w-[75px] overflow-hidden'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ produto.image[0] }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <h3 className='rounded-lg relative h-[75px] w-full overflow-hidden' >{ produto.nome }</h3>
            </div>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center border-solid border-2 secColor border-pink-200 rounded">
                    <button className="px-4 py-1 text-pink-300 text-lg secColor rounded hover:bg-gray-300">-</button>
                    <span className="px-4 p-1 bg-white" >1</span>
                    <button className="px-4 py-1 text-pink-300 text-lg secColor rounded hover:bg-gray-300">+</button>
                </div>
                <div className="ml-4">
                    <span className="font-semibold">R$ { produto.preco.toFixed(2) }</span>
                </div>
            </div>
        </div>
    );
}