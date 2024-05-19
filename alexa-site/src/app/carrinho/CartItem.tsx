import Image from 'next/image';
import { ProductType } from '../utils/types';
import { FaRegTrashAlt } from 'react-icons/fa';

export default function CartItem({ produto }: {produto: ProductType}) {
    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white shadow-lg rounded-lg shadowColor' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-[75px] w-[75px] overflow-hidden'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ produto.image[0] }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='rounded-lg relative w-3/4 overflow-hidden text-sm' >
                    <p >{ produto.nome }</p>
                </div>
                <FaRegTrashAlt />
            </div>
            <div className="flex justify-between items-center w-full">
                
                <div className="flex items-center secColor rounded">
                    <button className="px-4 py-1 textColored text-lg secColor rounded hover:bg-gray-300 border-solid border-2  borderColor">-</button>
                    <span className="px-4 p-1 bg-white gray-300 border-solid border-2 borderColor border-x-0" >1</span>
                    <button className="px-4 py-1 textColored text-lg secColor rounded hover:bg-gray-300 border-solid border-2  borderColor">+</button>
                </div>
                <div className="ml-4">
                    <span className="font-semibold">R$ { produto.preco.toFixed(2) }</span>
                </div>
            </div>
        </div>
    );
}