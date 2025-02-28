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
    if (value.promotionalPrice) {
        return (
            <div className="flex flex-col items-end">
                <p className="font-medium text-sm md:text-base lg:text-lg text-gray-400 line-through">
                    { formatPrice(value.price * quantidade) }
                </p>
                <p className="font-semibold text-base md:text-lg lg:text-xl text-[#333]">
                    { formatPrice(value.promotionalPrice * quantidade) }
                </p>
            </div>
        );
    }

    return (
        <p className="font-semibold text-base md:text-lg lg:text-xl text-[#333]">
            { formatPrice(value.price * quantidade) }
        </p>
    );
}
