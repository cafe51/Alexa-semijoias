import { formatPrice } from '../utils/formatPrice';

type PriceProps = {
    value: {
        price: number;
        promotionalPrice: number;
        cost: number;
    };
    quantidade: number;
};

export default function CartCardPrice({ value, quantidade }: PriceProps) {
    if(value.promotionalPrice) {
        console.log('PROMOCIONAL', value.promotionalPrice);
        return (
            <div className='flex flex-col'>
                <p className='font-semibold md:text-lg lg:text-xl xl:text-2xl text-gray-400 line-through'>
                    { formatPrice((value.price) * quantidade) }
                </p>
                <p className="font-semibold md:text-lg lg:text-xl xl:text-2xl">
                    { formatPrice((value.promotionalPrice) * quantidade) }
                </p>
            </div>
        );
    
    }
    return (
        <p className="font-semibold md:text-lg lg:text-xl xl:text-2xl">
            { formatPrice((value.price) * quantidade) }
        </p>
    );
}