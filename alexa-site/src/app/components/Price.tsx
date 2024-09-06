import { formatPrice } from '../utils/formatPrice';

interface PriceProps {
    price: number;
    promotionalPrice: number;
    quantity: number;
}



export default function Price({ price, promotionalPrice, quantity }: PriceProps) {
    const finalPrice = promotionalPrice > 0 ? (promotionalPrice * quantity) : (price * quantity);
    const precoParcelado = formatPrice(finalPrice/6);
    const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantity) : (price * quantity));

    return (
        <div>
            <div className='flex gap-2'>
                {
                    promotionalPrice > 0 &&
                <p className='font-bold text-xl text-gray-400 text-decoration: line-through'>{ formatPrice(price * quantity) }</p>
                }
                <p className='font-bold text-2xl '>{ precoCheio }</p>
            </div>
            <div className='text-sm'>
                <p className='font-bold text-sm'>
                em até 6x de <span className='font-bold text-sm'>{ precoParcelado }</span> sem juros
                </p>
            </div>
        </div>
    );
}