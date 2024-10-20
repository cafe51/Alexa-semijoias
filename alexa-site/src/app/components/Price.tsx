import { formatPrice } from '../utils/formatPrice';

interface PriceProps {
    price: number;
    promotionalPrice: number;
    quantity: number;
}

const calculateDiscount = (original: number, promotional: number) => {
    return Math.round(((original - promotional) / original) * 100);
};

export default function Price({ price, promotionalPrice, quantity }: PriceProps) {
    const finalPrice = promotionalPrice > 0 ? (promotionalPrice * quantity) : (price * quantity);
    const precoParcelado = formatPrice(finalPrice/6);
    const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantity) : (price * quantity));

    return (
        <div className='flex flex-col gap-4 py-4'>
            <div className='flex flex-wrap gap-2 md:gap-4'>
                <p className='text-2xl md:text-3xl font-bold text-[#D4AF37] '>{ precoCheio }</p>
                {
                    promotionalPrice > 0 &&
                    <>
                        <span className='ml-2 text-xl md:text-2xl text-gray-500 line-through'>{ formatPrice(price * quantity) }</span>
                        <span className="ml-2 text-sm md:text-lg text-[#C48B9F]">
                            { calculateDiscount(price, promotionalPrice) }% OFF
                        </span>
                    </>
                }
            </div>
            <div className=''>
                <p className='text-base md:text-lg'>em até 6x de <span className='font-bold text-lg md:text-xl text-[#D4AF37]'>{ precoParcelado }</span> sem juros</p>
            </div>
        </div>
    );
}